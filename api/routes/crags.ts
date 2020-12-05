import express from 'express';
import { checkJwt } from '../middleware/auth';

import { crags } from '../services';

const router = express.Router();

router
  .get('/', async (req, res) => {
    console.log('user', req.user);
    try {
      const allCrags = await crags.getAllCrags();
      res.status(200).json(allCrags);
    } catch (error) {
      console.error('Error getting crags', error);
      res.status(500).json({ error: true });
    }
  })

router
  .post('/', async (req, res) => {
    try {
      const cragDetails = req.body;
      const resp = await crags.createCrag(cragDetails);
      console.log(resp);
      res.status(200).json({ success: true });
    } catch(error) {
      console.error('Error creating crag', error);
      res.status(500).json({ error: true });
    }
  })

export default router;
