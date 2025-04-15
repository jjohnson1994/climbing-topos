'use server';
import { logs } from '@/app/data/services';

export const get = async (
  cragSlug: string,
  areaSlug: string,
  topoSlug: string,
  routeSlug: string,
  offset?: string,
  limit?: string,
) => {
  try {
    const routeLogs = await logs.getLogs(
      cragSlug,
      areaSlug,
      topoSlug,
      routeSlug,
    );

    return routeLogs;
  } catch (error) {
    console.error('Error loading routes', error);

    throw error;
  }
};
