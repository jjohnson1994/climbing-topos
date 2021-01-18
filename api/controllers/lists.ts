import { ListAddRouteRequest, ListRoutePartial } from "../../core/types";
import { lists, routes } from "../services";

export async function getLists(req, res) {
  try {
    const userSub = req.user.sub;
    const userLists = await lists.getLists(userSub);

    res.status(200).json(userLists);
  } catch (error) {
    console.error("Error getting list", error);
    res.status(500).json({ error: true });
  }
}

export async function postList(req, res) {
  try {
    const userSub = req.user.sub;
    const newList = await lists.createList(userSub, req.body);

    res.status(200).json({ success: true, ...newList });
  } catch (error) {
    console.error("Error creating new list", error);
    res.status(500).json({ error: true });
  }
}

export async function patchList(req, res) {
  try {
    const userSub = req.user.sub;
    const listSlug = req.query.listSlug;
    const newRoutes = req.body.routes as ListAddRouteRequest[];
    const list = await lists.getListBySlug(userSub, listSlug);

    const routesToList = await Promise.all(
      newRoutes.map(async routeReq => routes.getRouteBySlug(
        userSub,
        routeReq.cragSlug,
        routeReq.areaSlug,
        routeReq.topoSlug,
        routeReq.routeSlug
      )),
    );

    const updateResponse = await lists.addRoutesToList(
      userSub,
      listSlug,
      routesToList.map(route => ({
        areaSlug: route.areaSlug,
        areaTitle: route.title,
        country: route.country,
        countryCode: route.countryCode,
        county: route.county,
        cragSlug: route.cragSlug,
        cragTitle: route.cragTitle,
        grade: route.grade,
        gradingSystem: route.gradingSystem,
        latitude: route.latitude,
        listSlug,
        listTitle: list.title,
        longitude: route.longitude,
        rockType: route.rockType,
        routeSlug: route.slug,
        routeType: route.routeType,
        state: route.state,
        title: route.title,
        topoSlug: route.topoSlug
      }))
    );

    res.status(200).json({ success: true, ...updateResponse });
  } catch (error) {
    console.error("Error creating new list", error);
    res.status(500).json({ error: true });
  }
}

