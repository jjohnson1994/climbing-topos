import express from 'express';
import { checkJwt } from '../middleware/auth';

import { areas } from "../controllers";

const router = express.Router();

router.post('/', areas.postArea)
router.get('/:areaSlug/', areas.getArea);

export default router;
