import {
  UserPublicData,
  ListRequest,
  ListRoutePartial,
} from '@climbingtopos/types';
import { lists } from '../models';

export async function getListBySlug(userSub: string, listSlug: string) {
  const [metadata, routes] = await Promise.all([
    lists.getListBySlug(userSub, listSlug),
    lists.getListRoutes(userSub, listSlug),
  ]);

  return {
    ...metadata,
    routes,
  };
}
export function getLists(userSub: string) {
  return lists.getUserLists(userSub);
}

export function createList(user: UserPublicData, params: ListRequest) {
  return lists.createList(user, params);
}

export function addRoutesToList(
  userSub: string,
  listSlug: string,
  routes: ListRoutePartial[],
) {
  return Promise.all(
    routes.map((route) => lists.addRouteToList(userSub, listSlug, route)),
  );
}

export async function incrementRoutesCount(listSlug: string, userSub: string) {
  return lists.update(listSlug, userSub, {
    UpdateExpression: 'set #routeCount = #routeCount + :inc',
    ExpressionAttributeNames: {
      '#routeCount': 'routeCount',
    },
    ExpressionAttributeValues: {
      ':inc': 1,
    },
  });
}

export async function decrementRoutesCount(listSlug: string, userSub: string) {
  return lists.update(listSlug, userSub, {
    UpdateExpression: 'set #routeCount = #routeCount - :dec',
    ExpressionAttributeNames: {
      '#routeCount': 'routeCount',
    },
    ExpressionAttributeValues: {
      ':dec': 1,
    },
  });
}

export function getListsContainingRoute(userSub: string, routeSlug: string) {
  return lists.getListsContainingRoute(userSub, routeSlug);
}

export function removeRouteFromList(
  userSub: string,
  listSlug: string,
  cragSlug: string,
  areaSlug: string,
  topoSlug: string,
  routeSlug: string,
) {
  return lists.removeRouteFromList(
    userSub,
    listSlug,
    cragSlug,
    areaSlug,
    topoSlug,
    routeSlug,
  );
}
