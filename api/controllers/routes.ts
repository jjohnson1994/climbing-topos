import { routes } from "../services";

export async function postRoute(req, res) {
  try {
    const routeDetails = req.body;
    const resp = await routes.createRoute(routeDetails);
    res.status(200).json({ success: true, inserted: resp });
  } catch(error) {
    console.error('Error creating route', error);
    res.status(500).json({ error: true });
  }   
}

export async function getRoute(req, res) {
  try {
    const { cragSlug, areaSlug, topoSlug, routeSlug } = req.query;
    console.log({ cragSlug, areaSlug, topoSlug, routeSlug });
    const route = await routes.getRouteBySlug(cragSlug, areaSlug, topoSlug, routeSlug);
    res.status(200).json(route);
  } catch(error) {
    console.error("Error loading routes", error);
    res.status(500).json({ error: true });
  }
}
