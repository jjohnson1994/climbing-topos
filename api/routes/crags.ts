import express from 'express';
import { optionalAuth, requireAuth } from '../middleware/auth';

import { crags } from "../controllers";

const router = express.Router();

router.get('/', optionalAuth, crags.getCrags)
router.get('/:slug/', optionalAuth, crags.getCragBySlug)
router.post('/', requireAuth, crags.postCrag)

export default router;
