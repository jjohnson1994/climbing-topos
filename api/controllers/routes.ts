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
