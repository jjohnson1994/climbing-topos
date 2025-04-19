'use server';

import { auth, login } from '@/app/actions';
import { lists } from '@/app/data/services';

export const get = async (slug?: string) => {
  try {
    const user = await auth();

    const userSub = user ? user.properties.sub : undefined;

    if (!userSub) {
      return [];
    }

    if (slug) {
      const listReponse = await lists.getListBySlug(userSub, slug);

      return listReponse;
    } else {
      const userLists = await lists.getLists(userSub);

      return userLists;
    }
  } catch (error) {
    console.error('Error getting lists', error);

    throw error;
  }
};
