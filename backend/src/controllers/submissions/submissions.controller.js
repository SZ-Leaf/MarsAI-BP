import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { getVideoDurationInSeconds } from 'get-video-duration';

import {
  createSubmission,
  updateFilePaths,
  getSubmissions,
  getSubmissionById,
  updateYoutubeLinkInDatabase,
  updateYoutubeStatus
} from '../../models/submissions/submissions.model.js';
import collaboratorModel from '../../models/submissions/collaborators.model.js';
import galleryModel from '../../models/submissions/gallery.model.js';
import socialModel from '../../models/socials/socials.model.js';
import submissions_tagsModel from '../../models/tags/submissions_tags.model.js';
import { getTagsBySubmissionId } from '../../models/tags/submissions_tags_youtube.model.js';

import { sendError, sendSuccess } from '../../helpers/response.helper.js';
import { submissionSchema } from '../../utils/schemas/submission.schemas.js';
import { verifyRecaptcha } from '../../utils/recaptcha.js';
import { sendSubmissionConfirmation } from '../../services/mailer/mailer.mail.js';
import db from '../../config/db_pool.js';

import { uploadVideo, uploadThumbnail, uploadOrUpdateCaptions } from '../../services/youtube.services.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getUploadsBasePath = () => {
  return path.join(__dirname, '../../../uploads');
};

export const submitController = async (req, res) => {
  const recaptchaToken = req.body?.recaptchaToken;
  const recaptchaOk = await verifyRecaptcha(recaptchaToken, req.ip);
  if (!recaptchaOk) {
    return sendError(res, 400, 'Vérification anti-robot invalide ou expirée. Réessayez.', 'Invalid or expired captcha. Please try again.', null);
  }

  if (!req.files || !req.files.video) {
    return sendError(res, 400, 'Fichier vidéo manquant', 'Video file missing', null);
  }
  if(!req.files.cover) {
    return sendError(res, 400, 'Image de couverture manquante', 'Cover image missing', null);
  }

  const videoFile = req.files.video[0];
  const coverFile = req.files.cover[0];
  const subtitlesFile = req.files.subtitles ? req.files.subtitles[0] : null;
  const galleryFiles = req.files.gallery || [];

  const maxVideoSize = 300 * 1024 * 1024;
  const maxImageSize = 5 * 1024 * 1024;
  const videoExt = path.extname(videoFile.originalname).toLowerCase();

  if (!['.mp4', '.mov'].includes(videoExt) || !['video/mp4', 'video/quicktime'].includes(videoFile.mimetype)) {
    return sendError(res, 400, 'Format vidéo invalide. Formats acceptés : MP4, MOV', 'Invalid video format. Accepted formats: MP4, MOV', null);
  }

  if (videoFile.size > maxVideoSize) {
    return sendError(res, 400, `Fichier vidéo trop volumineux.`, null, null);
  }

  if (!req.body.data) {
    return sendError(res, 400, 'Information manquante', 'Missing information', null);
  }

  let submissionData;
  try {
    submissionData = JSON.parse(req.body.data);
  } catch {
    return sendError(res, 400, 'Données entrées invalides', 'Invalid data entered', null);
  }

  let validatedData;
  try {
    validatedData = submissionSchema.parse(submissionData);
  } catch (err) {
    return sendError(res, 422, 'Données invalides', 'Invalid data', err.message);
  }

  let durationSeconds = null;
  try {
    durationSeconds = await getVideoDurationInSeconds(videoFile.path);
    durationSeconds = Math.round(durationSeconds);
  } catch (err) {
    console.warn('Error calculating video duration:', err.message);
  }

  let connection;
  let transactionStarted = false;

  try {
    connection = await db.pool.getConnection();
    await connection.beginTransaction();
    transactionStarted = true;

    const submissionId = await createSubmission(
      connection,
      validatedData,
      videoFile.path,
      coverFile.path,
      durationSeconds
    );

    await submissions_tagsModel.addTagsToSubmission(connection, submissionId, validatedData.tagIds);

    const finalDir = path.join(getUploadsBasePath(), 'submissions', submissionId.toString());
    await fs.mkdir(path.join(finalDir, 'gallery'), { recursive: true });

    const finalVideoPath = path.join(finalDir, `video${videoExt}`);
    const finalCoverExt = path.extname(coverFile.originalname).toLowerCase();
    const finalCoverPath = path.join(finalDir, `cover${finalCoverExt}`);

    await fs.rename(videoFile.path, finalVideoPath);
    await fs.rename(coverFile.path, finalCoverPath);

    let finalSubtitlesPath = null;
    let subtitlesExt = null;

    if (subtitlesFile) {
      subtitlesExt = path.extname(subtitlesFile.originalname).toLowerCase();
      finalSubtitlesPath = path.join(finalDir, `subtitles${subtitlesExt}`);
      await fs.rename(subtitlesFile.path, finalSubtitlesPath);
    }

    const videoUrl = `/uploads/submissions/${submissionId}/video${videoExt}`;
    const coverUrl = `/uploads/submissions/${submissionId}/cover${finalCoverExt}`;
    const subtitlesUrl = finalSubtitlesPath ? `/uploads/submissions/${submissionId}/subtitles${subtitlesExt}` : null;

    await updateFilePaths(connection, submissionId, videoUrl, coverUrl, subtitlesUrl);

    const galleryUrls = [];
    for (let i = 0; i < galleryFiles.length; i++) {
      const file = galleryFiles[i];
      const ext = path.extname(file.originalname).toLowerCase();
      const finalPath = path.join(finalDir, 'gallery', `image${i + 1}${ext}`);
      await fs.rename(file.path, finalPath);
      galleryUrls.push(`/uploads/submissions/${submissionId}/gallery/image${i + 1}${ext}`);
    }

    if (galleryUrls.length) {
      await galleryModel.createGalleryImages(connection, submissionId, galleryUrls);
    }

    if (validatedData.collaborators?.length) {
      await collaboratorModel.createCollaborators(connection, submissionId, validatedData.collaborators);
    }

    if (validatedData.socials?.length) {
      await socialModel.createSocials(connection, submissionId, validatedData.socials);
    }

    await connection.commit();
    transactionStarted = false;

    let youtubeUrl = null;
    try {
      const tagsData = await getTagsBySubmissionId(submissionId);
      const ytTags = tagsData.map(tag => tag.title);

      const ytResponse = await uploadVideo({
        title: validatedData.english_title || validatedData.original_title,
        description: validatedData.english_synopsis,
        tags: ytTags,
        filePath: finalVideoPath
      });

      if (ytResponse.id) {
        await uploadThumbnail({ videoId: ytResponse.id, thumbnailPath: finalCoverPath });
        if (finalSubtitlesPath) {
          await uploadOrUpdateCaptions({ videoId: ytResponse.id, srtPath: finalSubtitlesPath });
        }

        youtubeUrl = `https://www.youtube.com/watch?v=${ytResponse.id}`;
        await updateYoutubeStatus(submissionId, 'uploaded', null);
        await updateYoutubeLinkInDatabase(youtubeUrl, submissionId);
      }
    } catch (ytError) {
      console.error('YouTube upload failed:', ytError.message);
      await updateYoutubeStatus(submissionId, 'failed', ytError.message);
    }

    try {
      await sendSubmissionConfirmation(validatedData.creator_email, validatedData.creator_firstname, validatedData.english_title || '');
    } catch (emailErr) {
      console.warn('Envoi email confirmation:', emailErr.message);
    }

    return sendSuccess(res, 201, 'Soumission créée avec succès', 'Submission created successfully', {
      submission_id: submissionId,
      youtube_url: youtubeUrl
    });

  } catch (error) {
    if (connection && transactionStarted) {
      await connection.rollback();
    }
    console.error('Erreur soumission:', error);
    return sendError(res, 500, 'Erreur lors de la création de la soumission', 'Error creating submission', null);
  } finally {
    if (connection) connection.release();
  }
};

export const getSubmissionsController = async (req, res) => {
  try {
    const { type, limit = 15, offset = 0, sortBy, rated } = req.query;
    const filters = {
      type: type || null,
      limit: parseInt(limit) || 15,
      offset: parseInt(offset) || 0,
      orderBy: sortBy?.toLowerCase() === 'asc' ? 'ASC' : 'DESC',
      rated: rated?.toLowerCase() === 'rated' ? 'rated' : (rated?.toLowerCase() === 'unrated' ? 'unrated' : null)
    };
    const {submissions, total} = await getSubmissions(filters);
    return sendSuccess(res, 200, 'Succès', 'Success', { count: total, submissions });
  } catch (error) {
    return sendError(res, 500, 'Erreur', 'Error', error.message);
  }
};

export const getSubmissionByIdController = async (req, res) => {
  try {
    const submissionId = parseInt(req.params.id);
    const submission = await getSubmissionById(submissionId);
    if (!submission) return res.status(404).json({ error: 'Non trouvé' });
    res.status(200).json({ success: true, submission });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
