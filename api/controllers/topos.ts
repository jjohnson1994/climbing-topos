import { topos } from "../services";

export async function postTopo(req, res) {
  try {
    const topoDetails = req.body;
    const imageFile = req.file;

    await topos.createTopo(topoDetails, imageFile);

    res.status(200).send({ success: true });
  } catch(error) {
    console.error("Error creating topo", error);
    res.status(500).json({ error: true });
  }
}
