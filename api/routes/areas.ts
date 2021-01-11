import * as yup from "yup";
import express from 'express';
import { optionalAuth, requireAuth } from '../middleware/auth';

import { areas } from "../controllers";
import { NewAreaSchema } from '../../core/schemas';
import { validateBody } from "../middleware/validate";
import { crags } from "../models";

const router = express.Router();
const newAreaSchema = NewAreaSchema(yup);

async function ensureCragExists(req, res, next) {
  try {
    const cragSlug = req.body.cragSlug;
    const crag = await crags.getCragBySlug(cragSlug);

    if (crag) {
      next();
    } else {
      res.status(400).json({ error: true });
    }
  } catch(error) {
    res.status(500).json({ error: true });
  }
}

router.post('/', requireAuth, validateBody(newAreaSchema), ensureCragExists, areas.postArea)
router.get('/:areaSlug/', optionalAuth, areas.getArea);

export default router;
