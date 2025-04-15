'use server';

import { RouteRequest } from '@climbingtopos/types';
import { routes } from '@/app/data/services';
import { auth, login } from '@/app/actions';

export const post = async (body: RouteRequest) => {
  try {
    const routeDetails = body;
    const user = await auth();

    if (user === false) {
      return login();
    }

    const resp = await routes.createRoute(routeDetails, user.properties);

    return { success: true, inserted: resp };
  } catch (error) {
    console.error('Error creating route', error);
    throw error;
  }
};

export type Post = typeof post;
