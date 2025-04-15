'use server';
import { areas } from '@/app/data/services';
import { auth } from '@/app/actions';

export const get = async (areaSlug: string) => {
  try {
    const user = await auth();
    const userSub = user ? user?.properties.sub : undefined;

    const area = await areas.getAreaBySlug(areaSlug, userSub);

    return area;
  } catch (error) {
    console.error('Error getting Area', error);
  }
};
