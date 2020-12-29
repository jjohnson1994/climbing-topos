import { crags } from '../services';

export async function getCrags(req, res) {
  try {
    const allCrags = await crags.getAllCrags();
    res.status(200).json(allCrags);
  } catch (error) {
    console.error('Error getting crags', error);
    res.status(500).json({ error: true });
  }
}

export async function getCragBySlug(req, res) {
  try {
    const { slug } = req.params;
    const user = req.user;
    const crag = await crags.getCragBySlug(slug, user);
    res.status(200).json(crag);
  } catch (error) {
    console.error('Error getting crags', error);
    res.status(500).json({ error: true });
  }
}

export async function postCrag(req, res) {
  try {
    const cragDetails = req.body;
    const resp = await crags.createCrag(cragDetails);
    res.status(200).json({ success: true, inserted: resp });
  } catch(error) {
    console.error('Error creating crag', error);
    res.status(500).json({ error: true });
  }
}
