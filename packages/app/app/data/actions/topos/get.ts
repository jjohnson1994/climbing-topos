'use server';
import { topos } from '@/app/data/services';

export const get = async (topoSlug: string) => {
  try {
    const topo = await topos.getTopoBySlug(topoSlug);

    return topo;
  } catch (error) {
    console.error('Error getting Topo', error);

    throw error;
  }
};
