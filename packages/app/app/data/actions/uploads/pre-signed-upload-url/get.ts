'use server';
import { Resource } from 'sst';
import { nanoid } from 'nanoid';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { auth } from '@/app/actions';

export const get = async () => {
  const user = await auth();

  if (!user) {
    throw new Error('Not authorised');
  }

  const key = nanoid();

  const s3Client = new S3Client();
  const command = new PutObjectCommand({
    Bucket: Resource.climbingtopos2Images.name,
    Key: key,
    ContentType: 'image/jpeg',
  });

  const url = await getSignedUrl(s3Client, command, {
    expiresIn: 300,
  });

  return {
    success: true,
    url,
    objectUrl: `${process.env.IMAGES_CDN_URL}/${key}`,
  };
};
