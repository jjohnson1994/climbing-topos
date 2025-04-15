'use server';

import { auth, login } from '@/app/actions';
import { logs } from '@/app/data/services';

export const get = async (
  cragSlug?: string,
  areaSlug?: string,
  topoSlug?: string,
  routeSlug?: string,
) => {
  try {
    const user = await auth();
    const userSub = user ? user.properties.sub : undefined;

    if (!userSub) {
      return login();
    }

    const userLogs = await logs.getUserLogs(
      userSub,
      cragSlug,
      areaSlug,
      topoSlug,
      routeSlug,
    );

    return userLogs;
  } catch (error) {
    console.error('Error getting user logs', error);
    throw error;
  }
};
