import * as yup from "yup";
import express from 'express';
import { topos } from "../controllers";
import { requireAuth, optionalAuth } from '../middleware/auth';
import { NewTopoSchema } from "../../core/schemas";
import { validateBody } from "../middleware/validate";
import { areas } from "../models";

const router = express.Router();
const newTopoSchema = NewTopoSchema(yup);

async function ensureAreaExists(req, res, next) {
  try {
    const area = await areas.getAreaBySlug(req.body.areaSlug);
    if (area) {
      next();
    } else {
      res.status(400).json({ error: true });
    }
  } catch (error) {
    res.status(500).json({ error: true });
  }
}

router.post('/', requireAuth, validateBody(newTopoSchema), ensureAreaExists, topos.postTopo)
router.get('/:topoSlug', optionalAuth, topos.getTopo)

export default router;
