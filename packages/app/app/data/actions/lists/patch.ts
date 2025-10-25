'use server';

import * as yup from 'yup';
import { ListAddRouteRequest } from '@climbingtopos/types';
import { lists, routes } from '@/app/data/services';
import { RequestValidator } from '@/app/helpers/request-validator';
import { auth, login } from '@/app/actions';

const validateBody =
  (body: ListAddRouteRequest[]): RequestValidator =>
    async () => {
      const schema = yup.array().of(
        yup.object().shape({
          cragSlug: yup.string().required(),
          areaSlug: yup.string().required(),
          topoSlug: yup.string().required(),
          routeSlug: yup.string().required(),
        }),
      );
      const isValid = await schema.isValid(body);

      if (isValid) {
        return true;
      } else {
        throw new Error('Invalid Request: Schema not valid');
      }
    };

const validateSlug =
  (slug: string): RequestValidator =>
    async () => {
      const schema = yup.string().required();
      const isValid = await schema.isValid(slug);

      if (isValid) {
        return true;
      } else {
        throw new Error('Invalid Request: Slug not valid');
      }
    };

export const patch = async (slug: string, body: ListAddRouteRequest[]) => {
  try {
    const user = await auth();
    const bodyIsValid = await validateBody(body)();

    if (bodyIsValid !== true) {
      return bodyIsValid;
    }

    const slugIsValid = await validateSlug(slug)();

    if (slugIsValid !== true) {
      return slugIsValid;
    }

    const userSub = user ? user.properties.sub : undefined;

    if (!userSub) {
      return login();
    }

    const newRoutes = body;
    const list = await lists.getListBySlug(userSub, slug);

    const routesToList = await Promise.all(
      newRoutes.map(async (routeReq) =>
        routes.listRoutes(
          userSub,
          routeReq.cragSlug,
          routeReq.areaSlug,
          routeReq.topoSlug,
          routeReq.routeSlug,
        ),
      ),
    );

    const updateResponse = await lists.addRoutesToList(
      userSub,
      slug,
      routesToList.map((route) => ({
        areaSlug: route.areaSlug,
        areaTitle: route.title,
        country: route.country,
        countryCode: route.countryCode,
        county: route.county,
        cragSlug: route.cragSlug,
        cragTitle: route.cragTitle,
        grade: route.grade,
        gradeModal: route.gradeModal,
        gradingSystem: route.gradingSystem,
        latitude: route.latitude,
        slug,
        listSlug: list.slug,
        listTitle: list.title,
        longitude: route.longitude,
        rockType: route.rockType,
        routeSlug: route.slug,
        routeType: route.routeType,
        state: route.state,
        title: route.title,
        topoSlug: route.topoSlug,
      })),
    );

    lists.incrementRoutesCount(slug, userSub).catch((error) => {
      console.error('Error incrementing list routes count', error);
    });

    return { success: true, ...updateResponse };
  } catch (error) {
    console.error('Error creating new list', error);

    throw error;
  }
};
