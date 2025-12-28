'use server';

import { Resource } from 'sst';
import { nanoid } from 'nanoid';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import sharp from 'sharp';

const region = process.env.AWS_REGION;

export const getUploadUrl = async (preferredKey?: string) => {
  const fileKey = preferredKey ? preferredKey : nanoid();

  const s3Client = new S3Client();
  const command = new PutObjectCommand({
    Bucket: Resource.climbingtopos2Images.name,
    Key: fileKey,
    ContentType: 'image/*',
  });

  const fileUploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 300,
  });

  return { fileUploadUrl, fileKey };
};

export const uploadFile = async (file: File, preferredKey?: string) => {
  // Server-side validation
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB - hard limit
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit. Please compress your image.`);
  }

  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Only images (JPEG, PNG, WebP, GIF) are allowed.');
  }

  // Convert File to Buffer for Sharp processing
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Server-side compression and optimization using Sharp
  // This acts as a safety net in case client-side compression was bypassed or failed
  const processedBuffer = await sharp(buffer)
    .resize(800, 800, {
      fit: 'inside', // Maintain aspect ratio, don't exceed 800x800
      withoutEnlargement: true, // Don't upscale small images
    })
    .jpeg({
      quality: 85, // High quality for server-side (client already did 80%)
      progressive: true, // Progressive JPEG for better web performance
    })
    .toBuffer();

  const processedSize = processedBuffer.length;
  console.log('Server-side processing:');
  console.log('  Original size:', (file.size / 1024).toFixed(2), 'KB');
  console.log('  Processed size:', (processedSize / 1024).toFixed(2), 'KB');
  console.log('  Reduction:', ((1 - processedSize / file.size) * 100).toFixed(1) + '%');

  // Create a new File object from the processed buffer
  const processedFile = new File([processedBuffer], file.name, {
    type: 'image/jpeg',
  });

  const { fileUploadUrl, fileKey } = await getUploadUrl(preferredKey);

  const response = await fetch(fileUploadUrl, {
    body: processedFile,
    method: 'PUT',
    headers: {
      'Content-Type': 'image/jpeg',
      'Content-Disposition': `attachment; filename="${file.name}"`,
    },
  }).then(async (res) => {
    if (res.status !== 200) {
      console.error('Error uploading file', res);
      console.error(JSON.stringify(res, null, 4));

      throw res;
    }
  });

  return {
    response,
    fileUploadUrl,
    fileKey,
    fileUrl: `https://${Resource.climbingtopos2Images.name}.s3.${region}.amazonaws.com/${fileKey}`,
  };
};
