import { ListRequest, ListRoutePartial } from "../../core/types";
import { lists } from "../models";

export function getListBySlug(userSub: string, listSlug: string) {
  return lists.getListBySlug(userSub, listSlug);
}
export function getLists(userSub: string) {
  return lists.getUserLists(userSub);
}

export function createList(userSub: string, params: ListRequest) {
  return lists.createList(userSub, params);
}

export function addRoutesToList(userSub: string, listSlug: string, routes: ListRoutePartial[]) {
  return Promise.all(routes.map(route => 
    lists.addRouteToList(userSub, listSlug, route)
  ));
}
