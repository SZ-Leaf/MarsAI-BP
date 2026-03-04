// Service S3 Scaleway : envoi de fichiers vers le bucket et URLs publiques.
import 'dotenv/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const bucket = process.env.SCALEWAY_BUCKET_NAME;
const folder = process.env.SCALEWAY_FOLDER || '';
const region = process.env.SCALEWAY_REGION || 'fr-par';

const client = new S3Client({
  region,
  endpoint: process.env.SCALEWAY_ENDPOINT,
  credentials: {
    accessKeyId: process.env.SCALEWAY_ACCESS_KEY,
    secretAccessKey: process.env.SCALEWAY_SECRET_KEY,
  },
  forcePathStyle: true,
});

// Vérifie si S3 est configuré (clés .env présentes).
export function isS3Configured() {
  return !!(
    process.env.SCALEWAY_ACCESS_KEY &&
    process.env.SCALEWAY_SECRET_KEY &&
    process.env.SCALEWAY_BUCKET_NAME
  );
}

// Construit la clé S3 : folder/type/id/filename (ex. grp2/submissions/42/cover.jpg).
export function buildKey(type, id, filename) {
  const prefix = folder ? `${folder}/${type}/${id}` : `${type}/${id}`;
  return `${prefix}/${filename}`;
}

// Retourne l'URL publique Scaleway pour une clé S3.
export function getPublicUrl(key) {
  return `https://${bucket}.s3.${region}.scw.cloud/${key}`;
}

// Envoie un fichier vers S3 (body = buffer ou stream) et retourne l'URL publique.
export async function uploadFile(body, key, contentType = undefined) {
  if (!isS3Configured()) {
    throw new Error('S3 non configuré : vérifiez SCALEWAY_ACCESS_KEY, SCALEWAY_SECRET_KEY et SCALEWAY_BUCKET_NAME dans .env');
  }

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType ?? undefined,
      ACL: 'public-read',
    })
  );

  return getPublicUrl(key);
}
