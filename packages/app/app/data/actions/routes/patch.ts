'use server';
import { RoutePatch } from '@climbingtopos/types';
import { UpdateRouteScheme } from '@climbingtopos/schemas';
import { crags, routes } from '@/app/data/services';
import {
  RequestValidator,
  validateRequest,
} from '@/app/helpers/request-validator';
import { auth, login } from '@/app/actions';

const isValidSchema =
  (body: RoutePatch): RequestValidator =>
    async () => {
      if (!body) {
        throw new Error('invalid request');
      }

      const schema = UpdateRouteScheme();
      const isValid = await schema.isValid(body, {
        strict: true,
      });

      if (!isValid) {
        throw new Error('invalid request');
      }

      return true;
    };

export const patch = async (routeSlug: string, routePatch: RoutePatch) => {
  const user = await auth();

  try {
    if (!user) {
      console.error(
        'PATCH route request received without authorization header',
        routePatch,
      );

      return login();
    }

    const validationResponse = await validateRequest([
      isValidSchema(routePatch),
    ]);

    if (validationResponse !== true) {
      return validationResponse;
    }

    const userSub = user.properties.sub;
    const route = await routes.getRouteBySlug(routeSlug);
    const crag = await crags.getCragBySlug(route.cragSlug, userSub);

    if (crag.managedBy.sub !== userSub) {
      throw new Error(
        'Permission Error: You Do Not Have Permission to Patch this Route',
      );
    }

    await routes.updateRoute(
      route.cragSlug,
      route.areaSlug,
      route.topoSlug,
      routeSlug,
      routePatch,
    );

    return { success: true };
  } catch (error) {
    console.error('Error updating route', error);
    throw error;
  }
};
