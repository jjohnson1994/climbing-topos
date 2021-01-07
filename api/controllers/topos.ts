import { topos } from "../services";

export async function postTopo(req, res) {
  try {
    const topoDetails = req.body;
    const { user } = req;
    const userSub = user ? user.sub : false;
    await topos.createTopo(topoDetails, userSub);

    res.status(200).send({ success: true });
  } catch(error) {
    console.error("Error creating topo", error);
    res.status(500).json({ error: true });
  }
}

export async function getTopo(req, res) {
  try {
    const { topoSlug } = req.params;
    const topo = await topos.getTopoBySlug(topoSlug);

    res.status(200).json(topo);
  } catch(error) {
    console.error("Error getting Topo", error);
    res.status(500).json({ error: true });
  }
}
