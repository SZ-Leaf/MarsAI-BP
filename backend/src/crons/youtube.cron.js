import cron from 'node-cron';
import { getVideosToMonitor, updateYoutubeStatus } from '../models/submissions/submissions.model.js';
import { checkVideoStatus } from '../services/youtube.services.js'; // Tu devras créer cette fonction

const processYoutubeStatusCheck = async () => {
  const videos = await getVideosToMonitor();

  if (videos.length === 0) return;

  console.log(`[Monitor YouTube] 👀 Vérification de ${videos.length} vidéo(s)...`);

  for (const video of videos) {
    try {
      const url = new URL(video.youtube_url);
      const videoId = url.searchParams.get('v');

      if (!videoId) continue;

      const statusInfo = await checkVideoStatus(videoId);

      if (statusInfo.uploadStatus === 'rejected' || statusInfo.uploadStatus === 'failed') {
        const reason = statusInfo.rejectionReason || "Échec du traitement YouTube";
        console.error(`[Monitor] ❌ Vidéo ID ${video.id} REJETÉE : ${reason}`);

        await updateYoutubeStatus(video.id, 'failed', `YouTube Reject: ${reason}`);
      }
      else if (statusInfo.uploadStatus === 'processed') {
        console.log(`[Monitor] ✅ Vidéo ID ${video.id} est maintenant entièrement prête.`);
      }

    } catch (error) {
      console.error(`[Monitor] Erreur lors de la vérification ID ${video.id}:`, error.message);
    }
  }
};

cron.schedule('*/1 * * * *', () => {
  processYoutubeStatusCheck();
});
