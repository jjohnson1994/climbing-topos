import { Resource } from 'sst'
import { nanoid } from 'nanoid'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import sharp from 'sharp'

sharp.cache(false)

const s3 = new S3Client()
const MAX_INPUT_BYTES = 10 * 1024 * 1024
const MAX_DIMENSION = 2000

export const uploadImage = async (imageBase64: string): Promise<string> => {
  const buffer = Buffer.from(imageBase64, 'base64')

  if (buffer.length > MAX_INPUT_BYTES) {
    throw new Error('Image too large')
  }

  const processedBuffer = await sharp(buffer)
    .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer()

  const key = nanoid()
  await s3.send(
    new PutObjectCommand({
      Bucket: Resource.climbingtopos2Images.name,
      Key: key,
      Body: processedBuffer,
      ContentType: 'image/webp',
    }),
  )

  return `${process.env.IMAGES_CDN_URL}/${key}`
}

export const deleteImage = async (imageUrl: string): Promise<void> => {
  const prefix = `${process.env.IMAGES_CDN_URL}/`
  const key = imageUrl.startsWith(prefix) ? imageUrl.slice(prefix.length) : null
  if (!key) return

  await s3.send(
    new DeleteObjectCommand({
      Bucket: Resource.climbingtopos2Images.name,
      Key: key,
    }),
  )
}
