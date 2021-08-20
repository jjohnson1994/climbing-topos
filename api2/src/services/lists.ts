import { Auth0UserPublicData, ListRequest, ListRoutePartial } from "core/types";
import { lists } from "../models";

export async function getListBySlug(userSub: string, listSlug: string) {
  const [metadata, routes] = await Promise.all([
    lists.getListBySlug(userSub, listSlug),
    lists.getListRoutes(listSlug),
  ]);

  return {
    ...metadata,
    routes
  }
}
export function getLists(userSub: string) {
  return lists.getUserLists(userSub);
}

export function createList(user: Auth0UserPublicData, params: ListRequest) {
  return lists.createList(user, params);
}

export function addRoutesToList(user: Auth0UserPublicData, listSlug: string, routes: ListRoutePartial[]) {
  return Promise.all(routes.map(route => 
    lists.addRouteToList(user, listSlug, route)
  ));
}

export async function incrementRoutesCount(listSlug: string, userSub: string) {
  return lists.update(listSlug, userSub, {
    UpdateExpression: "set #routeCount = #routeCount + :inc",
    ExpressionAttributeNames: { 
      "#routeCount": "routeCount",
    },
    ExpressionAttributeValues: {
      ":inc": 1
    },
  });
}
