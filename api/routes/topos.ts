import express from 'express';
import { topos } from "../controllers";
import { requireAuth, optionalAuth } from '../middleware/auth';

const router = express.Router();

router.post('/', requireAuth, topos.postTopo)
router.get('/:topoSlug', optionalAuth, topos.getTopo)

export default router;
