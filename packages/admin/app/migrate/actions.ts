'use server';

import { cookies } from 'next/headers';
import { scanForUpdates, applyUpdates } from '@/app/data/models/migration';

async function resolveS3Prefix(): Promise<string> {
  const cookieStore = await cookies();
  const env = cookieStore.get('admin_environment')?.value ?? 'dev';

  let bucketName: string | undefined;

  if (env === 'production') {
    bucketName = process.env.PRODUCTION_S3_BUCKET_NAME;
    if (!bucketName) throw new Error('PRODUCTION_S3_BUCKET_NAME is not set in .env.local');
  } else {
    const bucketResource = process.env['SST_RESOURCE_climbingtopos2Images'];
    bucketName = bucketResource
      ? (JSON.parse(bucketResource) as { name: string }).name
      : process.env.S3_BUCKET_NAME;
    if (!bucketName) throw new Error('S3 bucket name not configured');
  }

  const region = process.env.AWS_REGION ?? 'eu-west-1';
  return `https://${bucketName}.s3.${region}.amazonaws.com/`;
}

async function resolveCdnUrl(): Promise<string> {
  const cookieStore = await cookies();
  const env = cookieStore.get('admin_environment')?.value ?? 'dev';

  const cdnUrl =
    env === 'production'
      ? process.env.PRODUCTION_IMAGES_CDN_URL
      : process.env.IMAGES_CDN_URL;

  if (!cdnUrl) {
    throw new Error(
      env === 'production'
        ? 'PRODUCTION_IMAGES_CDN_URL is not set in .env.local'
        : 'IMAGES_CDN_URL is not configured',
    );
  }

  return cdnUrl.replace(/\/$/, '');
}

export type DryRunState = {
  s3Prefix: string;
  cdnUrl: string;
  totalItems: number;
  summary: Record<string, number>;
  examples: Array<{ hk: string; sk: string; model: string; fields: string[] }>;
  error?: string;
} | null;

export type ExecuteState = {
  succeeded: number;
  failed: number;
  errors: string[];
  error?: string;
} | null;

export async function dryRun(_prev: DryRunState, _formData: FormData): Promise<DryRunState> {
  try {
    const s3Prefix = await resolveS3Prefix();
    const cdnUrl = await resolveCdnUrl();
    const plans = await scanForUpdates(s3Prefix, cdnUrl);

    const summary: Record<string, number> = {};
    for (const plan of plans) {
      summary[plan.model] = (summary[plan.model] ?? 0) + 1;
    }

    const examples = plans.slice(0, 20).map((p) => ({
      hk: p.hk,
      sk: p.sk,
      model: p.model,
      fields: p.changes.map((c) => c.field),
    }));

    return { s3Prefix, cdnUrl, totalItems: plans.length, summary, examples };
  } catch (err) {
    return {
      s3Prefix: '',
      cdnUrl: '',
      totalItems: 0,
      summary: {},
      examples: [],
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export async function executeMigration(_prev: ExecuteState, formData: FormData): Promise<ExecuteState> {
  try {
    if (formData.get('confirmation') !== 'MIGRATE') {
      return { succeeded: 0, failed: 0, errors: [], error: 'Type MIGRATE exactly to confirm.' };
    }

    const s3Prefix = await resolveS3Prefix();
    const cdnUrl = await resolveCdnUrl();
    const plans = await scanForUpdates(s3Prefix, cdnUrl);
    return await applyUpdates(plans);
  } catch (err) {
    return {
      succeeded: 0,
      failed: 0,
      errors: [],
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
