'use server';

import { auth } from '@/app/actions';
import { lists } from '@/app/data/services';

export const deleteRouteFromList = async (
  listSlug: string,
  cragSlug: string,
  areaSlug: string,
  topoSlug: string,
  routeSlug: string,
) => {
  try {
    const user = await auth();

    const userSub = user ? user.properties.sub : undefined;

    if (!userSub) {
      return { success: false, error: 'Not authenticated' };
    }

    await lists.removeRouteFromList(
      userSub,
      listSlug,
      cragSlug,
      areaSlug,
      topoSlug,
      routeSlug,
    );

    return { success: true };
  } catch (error) {
    console.error('Error removing route from list', error);

    return { success: false, error: 'Failed to remove route from list' };
  }
};
