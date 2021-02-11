import * as yup from "yup";
import express from 'express';
import { optionalAuth, requireAuth } from '../middleware/auth';

import { areas } from "../controllers";
import { NewAreaSchema } from '../../core/schemas';
import { validateBody } from "../middleware/validate";

const router = express.Router();
const newAreaSchema = NewAreaSchema(yup);

router.post('/', requireAuth, validateBody(newAreaSchema),  areas.postArea)
router.get('/:areaSlug/', optionalAuth, areas.getArea);

export default router;
