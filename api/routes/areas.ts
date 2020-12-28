import express from 'express';
import { optionalAuth, requireAuth } from '../middleware/auth';

import { areas } from "../controllers";

const router = express.Router();

router.post('/', requireAuth, areas.postArea)
router.get('/:areaSlug/', optionalAuth, areas.getArea);

export default router;
