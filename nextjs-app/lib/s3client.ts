import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const REGION = process.env.AWS_REGION;
const BUCKET = process.env.AWS_S3_BUCKET_NAME;
if (!REGION || !BUCKET) {
  throw new Error("Missing AWS_REGION or AWS_S3_BUCKET_NAME env variables");
}

export const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY || process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

/**
 * Upload (server-side). Body can be stream / buffer.
 */
export async function uploadToS3(key: string, body: any, contentType?: string) {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
  });
  return s3Client.send(command);
}

/**
 * Delete object
 */
export async function deleteFromS3(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });
  return s3Client.send(command);
}

/**
 * Generate a presigned GET URL for downloading an object from S3.
 * expiresInSec - seconds until URL expires (default 15 minutes)
 */
export async function getPresignedDownloadUrl(key: string, expiresInSec = 60 * 15) {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });
  return getSignedUrl(s3Client, command, { expiresIn: expiresInSec });
}

/**
 * (Optional) Generate a presigned PUT URL for direct browser upload.
 * expiresInSec - seconds until URL expires (default 15 minutes)
 */
export async function getPresignedUploadUrl(key: string, contentType = "application/octet-stream", expiresInSec = 60 * 15) {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(s3Client, command, { expiresIn: expiresInSec });
}