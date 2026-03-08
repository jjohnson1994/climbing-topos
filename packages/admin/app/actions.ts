'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Jimp } from 'jimp';
import * as userModel from '@/app/data/models/users';
import * as cragModel from '@/app/data/models/crags';
import * as areaModel from '@/app/data/models/areas';
import * as routeModel from '@/app/data/models/routes';
import * as logModel from '@/app/data/models/logs';
import type { CragEditFields, AreaEditFields, RouteEditFields, ActionResult } from '@/app/data/types';

export async function setEnvironment(env: string) {
  const cookieStore = await cookies();
  cookieStore.set('admin_environment', env, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  });
  revalidatePath('/', 'layout');
}

export async function setUserStatus(id: string, status: string) {
  await userModel.updateUser(id, { status });
  revalidatePath('/users');
  revalidatePath(`/users/${id}`);
}

export async function deleteUser(id: string) {
  await userModel.deleteUser(id);
  revalidatePath('/users');
}

export async function setCragVerified(slug: string, verified: boolean) {
  await cragModel.updateCrag(slug, { verified });
  revalidatePath('/crags');
  revalidatePath(`/crags/${slug}`);
}

export async function deleteCrag(slug: string) {
  await cragModel.deleteCrag(slug);
  revalidatePath('/crags');
}

export async function setAreaVerified(
  hk: string,
  sk: string,
  slug: string,
  verified: boolean,
) {
  await areaModel.updateArea(hk, sk, { verified });
  revalidatePath('/areas');
  revalidatePath(`/areas/${slug}`);
}

export async function deleteArea(hk: string, sk: string) {
  await areaModel.deleteArea(hk, sk);
  revalidatePath('/areas');
}

export async function setRouteVerified(
  hk: string,
  sk: string,
  slug: string,
  verified: boolean,
) {
  await routeModel.updateRoute(hk, sk, { verified });
  revalidatePath('/routes');
  revalidatePath(`/routes/${slug}`);
}

export async function deleteRoute(hk: string, sk: string) {
  await routeModel.deleteRoute(hk, sk);
  revalidatePath('/routes');
}

export async function deleteLog(hk: string, sk: string) {
  await logModel.deleteLog(hk, sk);
  revalidatePath('/logs');
}

export async function updateCragFields(
  slug: string,
  fields: CragEditFields,
): Promise<ActionResult> {
  try {
    await cragModel.updateCrag(slug, {
      ...fields,
      latitude: fields.latitude ? Number(fields.latitude) : undefined,
      longitude: fields.longitude ? Number(fields.longitude) : undefined,
    });
    revalidatePath('/crags');
    revalidatePath(`/crags/${slug}`);
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to save changes' };
  }
}

export async function updateAreaFields(
  hk: string,
  sk: string,
  slug: string,
  fields: AreaEditFields,
): Promise<ActionResult> {
  try {
    await areaModel.updateArea(hk, sk, {
      ...fields,
      latitude: fields.latitude ? Number(fields.latitude) : undefined,
      longitude: fields.longitude ? Number(fields.longitude) : undefined,
    });
    revalidatePath('/areas');
    revalidatePath(`/areas/${slug}`);
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to save changes' };
  }
}

export async function uploadCragImage(
  slug: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const file = formData.get('file') as File;
    if (!file || file.size === 0) return { success: false, error: 'No file provided' };

    const bucketResource = process.env['SST_RESOURCE_climbingtopos2Images'];
    const bucketName = bucketResource
      ? (JSON.parse(bucketResource) as { name: string }).name
      : process.env.S3_BUCKET_NAME;
    if (!bucketName) throw new Error('S3 bucket not configured. Set S3_BUCKET_NAME in .env.local');

    const region = process.env.AWS_REGION ?? 'eu-west-1';
    const key = crypto.randomUUID();
    const arrayBuffer = await file.arrayBuffer();

    const image = await Jimp.read(Buffer.from(arrayBuffer));
    image.scaleToFit({ w: 2000, h: 2000 });

    const processedBuffer = await image.getBuffer('image/webp', { quality: 80 });

    const s3 = new S3Client({ region });
    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: processedBuffer,
        ContentType: 'image/webp',
      }),
    );

    const imageUrl = `${process.env.IMAGES_CDN_URL}/${key}`;
    await cragModel.updateCragImage(slug, imageUrl);
    revalidatePath(`/crags/${slug}`);
    return { success: true };
  } catch {
    return { success: false, error: 'Upload failed' };
  }
}

export async function updateRouteFields(
  hk: string,
  sk: string,
  slug: string,
  fields: RouteEditFields,
): Promise<ActionResult> {
  try {
    await routeModel.updateRoute(hk, sk, fields as unknown as Record<string, unknown>);
    revalidatePath('/routes');
    revalidatePath(`/routes/${slug}`);
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to save changes' };
  }
}
