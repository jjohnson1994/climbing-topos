import { AreaRequest } from "../../core/types";
import { areas, crags } from "../services";

export async function postArea(req, res) {
  try {
    const areaDetails = req.body as AreaRequest;
    const userSub = req.user.sub;
    const resp = await areas.createArea(areaDetails, userSub);

    res.status(200).json({ success: true, ...resp });
  } catch(error) {
    console.error('Error creating area', error);
    res.status(500).json({ error: true });
  }
}

export async function getArea(req, res) {
  try {
    const { areaSlug } = req.params;
    const { user } = req;
    const userSub = user ? user.sub : undefined;
    const area = await areas.getAreaBySlug(areaSlug, userSub);

    res.status(200).json(area);
  } catch(error) {
    console.error("Error getting Area", error);
    res.status(500).json({ error: true });
  }
}
