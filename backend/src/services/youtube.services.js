import fs from 'fs';
import { google } from 'googleapis';
import oauth2Client from '../config/oauth.js';
import 'dotenv/config';

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN
});

const youtube = google.youtube({
  version: 'v3',
  auth: oauth2Client
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const uploadVideo = async ({ title, description, tags = [], filePath }) => {
  const { token } = await oauth2Client.getAccessToken();

  oauth2Client.setCredentials({
    access_token: token
  });

  const response = await youtube.videos.insert({
    part: 'snippet,status',
    requestBody: {
      snippet: {
        title,
        description,
        tags
      },
      status: {
        privacyStatus: 'private'
      }
    },
    media: {
      body: fs.createReadStream(filePath)
    }
  });

  return response.data;
};

export const uploadThumbnail = async ({ videoId, thumbnailPath }) => {
  try {
    const response = await youtube.thumbnails.set({
      videoId,
      media: {
        body: fs.createReadStream(thumbnailPath)
      }
    });

    return response.data;
  } catch (err) {
    console.error('THUMBNAIL ERROR:', err.response?.data || err.message);
    throw err;
  }
};

export const uploadOrUpdateCaptions = async ({
  videoId,
  srtPath,
}) => {
  if (!videoId) throw new Error('videoId manquant pour les sous-titres');
  if (!srtPath) throw new Error('srtPath manquant pour les sous-titres');

  try {
    // Vérifier que le fichier existe
    await fs.promises.access(srtPath);

    // Supprimer les sous-titres existants
    const { data } = await youtube.captions.list({
      part: ['id', 'snippet'],
      videoId
    });

    for (const track of (data.items || []).filter(t => t.snippet.language === language)) {
      await youtube.captions.delete({ id: track.id });
    }

    const response = await youtube.captions.insert({
      part: 'snippet',
      requestBody: {
        snippet: {
          videoId,
          language : 'fr',
          name: 'Français',
          isDraft: false
        }
      },
      media: {
        mimeType: 'application/octet-stream',
        body: fs.createReadStream(srtPath)
      }
    });

    return response.data;

  } catch (err) {
    console.error('CAPTIONS ERROR:', err.response?.data || err.message);
    throw err;
  }
};


export const uploadThumbnailAndCaptions = async (submission, videoId) => {
  try {
    if (submission.cover) {
      const thumbnailPath = `uploads/submissions/${submission.id}/${submission.cover.split('/').pop()}`;
      await uploadThumbnail({ videoId, thumbnailPath });
    }

    if (submission.subtitles) {
      const srtPath = `uploads/submissions/${submission.id}/${submission.subtitles.split('/').pop()}`;

      await uploadOrUpdateCaptions({
        videoId,
        srtPath,
        language: submission.language || 'fr',
        name: submission.language === 'fr' ? 'Français' : submission.language
      });
    }

  } catch (err) {
    console.error('THUMBNAIL/CAPTIONS ERROR:', err.message);
    throw err;
  }
};

export const uploadAllYoutubeAssets = async (submission) => {
  const { getTagsBySubmissionId } = await import('../models/tags/submissions_tags_youtube.model.js');

  const submissionTags = await getTagsBySubmissionId(submission.id);
  const youtubeTags = (submissionTags || []).map(tag => tag.title);

  const videoPath = `uploads/submissions/${submission.id}/${submission.video_url.split('/').pop()}`;

  const youtubeVideo = await uploadVideo({
    title: submission.english_title,
    description: submission.original_synopsis,
    tags: youtubeTags,
    filePath: videoPath
  });

  await sleep(15000);

  await uploadThumbnailAndCaptions(submission, youtubeVideo.id);

  return youtubeVideo;
};

export const deleteVideo = async (videoId) => {
  const { token } = await oauth2Client.getAccessToken();

  oauth2Client.setCredentials({
    access_token: token
  });

  const response = await youtube.videos.delete({
    id: videoId
  });

  return response.data;
};

export const updateYoutubeVideo = async ({
  videoId,
  title,
  description,
  tags = [],
  privacyStatus = 'private',
  categoryId = 28
}) => {
  const { token } = await oauth2Client.getAccessToken();

  oauth2Client.setCredentials({
    access_token: token
  });

  const response = await youtube.videos.update({
    part: 'snippet,status',
    requestBody: {
      id: videoId,
      snippet: {
        title,
        description,
        tags,
        categoryId
      },
      status: {
        privacyStatus
      }
    }
  });

  return response.data;
};
