import { areas } from "../services";

export async function postArea(req, res) {
  try {
    const areaDetails = req.body;
    const resp = await areas.createArea(areaDetails);
    res.status(200).json({ success: true, inserted: resp });
  } catch(error) {
    console.error('Error creating area', error);
    res.status(500).json({ error: true });
  }
}

export async function getArea(req, res) {
  try {
    const { areaSlug } = req.params;

    const area = await areas.getAreaBySlug(areaSlug);
    res.status(200).json(area);
  } catch(error) {
    console.error("Error getting Area", error);
    res.status(500).json({ error: true });
  }
}
