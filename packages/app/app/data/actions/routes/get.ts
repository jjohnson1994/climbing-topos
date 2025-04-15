'use server';
import { routes } from '@/app/data/services';
import { auth } from '@/app/actions';

export const get = async (
  cragSlug: string,
  areaSlug: string,
  topoSlug: string,
  routeSlug: string,
) => {
  try {
    const user = await auth();

    const userSub = user ? user.properties.sub : undefined;

    const route = await routes.listRoutes(
      userSub || '',
      cragSlug,
      areaSlug,
      topoSlug,
      routeSlug,
    );

    return route;
  } catch (error) {
    console.error('Error loading routes', error);

    throw error;
  }
};
