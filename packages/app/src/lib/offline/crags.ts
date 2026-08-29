import type { Crag } from '@climbingtopos/types';
import {
  putOfflineCrag,
  getOfflineCragRecord,
  deleteOfflineCragRecord,
  listOfflineCragRecords,
  type OfflineCragRecord,
} from './db';

export type { OfflineCragRecord };

const OFFLINE_IMAGES_CACHE = 'ct-offline-images';

function cragImageUrls(crag: Crag): string[] {
  const urls = new Set<string>();
  if (typeof crag.image === 'string' && crag.image) urls.add(crag.image);
  for (const topo of crag.topos ?? []) {
    if (typeof topo.image === 'string' && topo.image) urls.add(topo.image);
  }
  return Array.from(urls);
}

async function fetchAndCacheImage(cache: Cache, url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
    await cache.put(url, response);
  } catch {
    const opaque = await fetch(url, { mode: 'no-cors' });
    await cache.put(url, opaque);
  }
}

export async function saveCragOffline(crag: Crag): Promise<void> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    throw new Error('Offline storage is not supported in this browser');
  }

  const imageUrls = cragImageUrls(crag);
  const cache = await caches.open(OFFLINE_IMAGES_CACHE);

  const results = await Promise.allSettled(
    imageUrls.map((url) => fetchAndCacheImage(cache, url)),
  );

  if (results.some((result) => result.status === 'rejected')) {
    await Promise.all(imageUrls.map((url) => cache.delete(url)));
    throw new Error('Failed to download one or more images for offline use');
  }

  const record: OfflineCragRecord = {
    slug: crag.slug,
    title: crag.title,
    image: typeof crag.image === 'string' ? crag.image : '',
    savedAt: Date.now(),
    approxBytes: JSON.stringify(crag).length,
    crag,
  };

  await putOfflineCrag(record);
}

export async function removeCragOffline(slug: string): Promise<void> {
  const record = await getOfflineCragRecord(slug);
  await deleteOfflineCragRecord(slug);

  if (!record || typeof window === 'undefined' || !('caches' in window)) return;

  const cache = await caches.open(OFFLINE_IMAGES_CACHE);
  await Promise.all(cragImageUrls(record.crag).map((url) => cache.delete(url)));
}

export async function isCragSavedOffline(slug: string): Promise<boolean> {
  const record = await getOfflineCragRecord(slug);
  return !!record;
}

export async function getOfflineCrag(slug: string): Promise<Crag | undefined> {
  const record = await getOfflineCragRecord(slug);
  return record?.crag;
}

export async function listOfflineCrags(): Promise<OfflineCragRecord[]> {
  const records = await listOfflineCragRecords();
  return records.sort((a, b) => b.savedAt - a.savedAt);
}
