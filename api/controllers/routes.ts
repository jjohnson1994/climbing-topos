import { RouteRequest } from "../../core/types";
import { areas, crags, routes } from "../services";

export async function postRoute(req, res) {
  try {
    const routeDetails = req.body as RouteRequest;
    const user = req.user;
    const resp = await routes.createRoute(routeDetails, user.sub);

    res.status(200).json({ success: true, inserted: resp });
  } catch(error) {
    console.error('Error creating route', error);
    res.status(500).json({ error: true });
  }   
}

export async function getRoute(req, res) {
  try {
    const { cragSlug, areaSlug, topoSlug, routeSlug } = req.query;
    const { user } = req;
    const userSub = user ? user.sub : undefined;
    const route = await routes.getRouteBySlug(userSub, cragSlug, areaSlug, topoSlug, routeSlug);
    res.status(200).json(route);
  } catch(error) {
    console.error("Error loading routes", error);
    res.status(500).json({ error: true });
  }
}
