'use server';

import { Resource } from 'sst';
import { nanoid } from 'nanoid';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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
  const { fileUploadUrl, fileKey } = await getUploadUrl(preferredKey);

  const response = await fetch(fileUploadUrl, {
    body: file,
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
      'Content-Disposition': `attachment; filename="${file.name}"`,
    },
  }).then(async (res) => {
    if (res.status !== 200) {
      console.error('Error uploading file', res.json());
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
