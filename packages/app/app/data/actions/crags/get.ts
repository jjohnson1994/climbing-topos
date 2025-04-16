'use server';
import { auth } from '@/app/actions';
import { crags } from '@/app/data/services';

export const get = async (
  cragSlug?: string,
  sortBy?: string,
  sortOrder?: 'DESC' | 'ASC',
  limit = '10',
  offset = '0',
) => {
  try {
    const user = await auth();
    const userSub = user ? user.properties.sub : undefined;

    if (cragSlug) {
      const crag = await crags.getCragBySlug(cragSlug, userSub || '');

      return crag;
    } else {
      const allCrags = await crags.getAllCrags(
        userSub || '',
        sortBy,
        sortOrder,
        parseInt(limit, 10),
        parseInt(offset, 10),
      );

      return allCrags;
    }
  } catch (error) {
    // TODO error handle
    console.error('Error getting crags', error);
    throw error;
  }
};
