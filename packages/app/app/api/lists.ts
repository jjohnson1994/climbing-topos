import { API } from "aws-amplify";
import { List } from "core/types";

export function addList(title: string): Promise<List> {
  return API.post("climbingtopos2-api", `/lists`, {
    body: { title },
  });
}

export function addRoutesToList(
  listSlug: string,
  routes: {
    cragSlug: string;
    areaSlug: string;
    topoSlug: string;
    routeSlug: string;
  }[]
) {
  return API.patch(
    "climbingtopos2-api",
    `/lists?listSlug=${listSlug}`,
    {
      body: { routes },
    }
  );
}

export function getLists(): Promise<List[]> {
  return API.get(
    "climbingtopos2-api",
    `/lists`,
    {}
  );
}

export function getList(listSlug: string): Promise<List> {
  return API.get(
    "climbingtopos2-api",
    `/lists/${listSlug}`,
    {}
  );
}
