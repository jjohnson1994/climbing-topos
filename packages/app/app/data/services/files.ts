'use server';

import { Resource } from 'sst';
import { nanoid } from 'nanoid';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Jimp } from 'jimp';

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
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit. Please compress your image.`);
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Only images (JPEG, PNG, WebP, GIF) are allowed.');
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const image = await Jimp.read(buffer);
  await image.scaleToFit(800, 800);
  await image.quality(85);
  const processedBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);

  const processedFile = new File([processedBuffer], file.name, {
    type: 'image/jpeg',
  });

  const { fileUploadUrl, fileKey } = await getUploadUrl(preferredKey);

  await fetch(fileUploadUrl, {
    body: processedFile,
    method: 'PUT',
    headers: {
      'Content-Type': 'image/jpeg',
      'Content-Disposition': `attachment; filename="${file.name}"`,
    },
  }).then(async (res) => {
    if (res.status !== 200) {
      throw res;
    }
  });

  return {
    fileUploadUrl,
    fileKey,
    fileUrl: `${process.env.IMAGES_CDN_URL}/${fileKey}`,
  };
};
