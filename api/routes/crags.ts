import * as yup from "yup";
import express from 'express';
import { optionalAuth, requireAuth } from '../middleware/auth';

import { crags } from "../controllers";
import { validateBody } from '../middleware/validate';
import { NewCragSchema } from '../../core/schemas';

const router = express.Router();
const newCragSchema = NewCragSchema(yup);

router.get('/', optionalAuth, crags.getCrags)
router.get('/:slug/', optionalAuth, crags.getCragBySlug)
router.post('/', requireAuth, validateBody(newCragSchema), crags.postCrag)

export default router;
