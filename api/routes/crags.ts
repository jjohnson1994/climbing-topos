import express from 'express';
import { checkJwt } from '../middleware/auth';

import { crags } from "../controllers";

const router = express.Router();

router.get('/', crags.getCrags)
router.get('/:slug/', crags.getCragBySlug)
router.post('/', crags.postCrag)

export default router;
