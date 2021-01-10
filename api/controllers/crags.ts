import { crags } from '../services';

export async function getCrags(req, res) {
  console.log("get crags");
  try {
    const { user } = req;
    const userSub = user ? user.sub : false;
    console.log("user", { userSub });
    const allCrags = await crags.getAllCrags(userSub);
    res.status(200).json(allCrags);
  } catch (error) {
    console.error('Error getting crags', error);
    res.status(500).json({ error: true });
  }
}

export async function getCragBySlug(req, res) {
  try {
    const { slug } = req.params;
    const { user } = req;
    const userSub = user ? user.sub : false;
    const crag = await crags.getCragBySlug(slug, userSub);
    res.status(200).json(crag);
  } catch (error) {
    console.error('Error getting crags', error);
    res.status(500).json({ error: true });
  }
}

export async function postCrag(req, res) {
  try {
    const cragDetails = req.body;
    const user = req.user;
    const resp = await crags.createCrag(cragDetails, user.sub);
    res.status(200).json({ success: true, inserted: resp });
  } catch(error) {
    console.error('Error creating crag', error);
    res.status(500).json({ error: true });
  }
}
