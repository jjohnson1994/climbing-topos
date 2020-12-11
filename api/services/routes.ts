import { routes } from "../models";
import { Route } from "../../core/types";

export const createRoute = (routeDescription: Route) => {
  return routes.createRoute(routeDescription);
}
