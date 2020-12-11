import express from 'express';
import { topos } from "../controllers";

const router = express.Router();

router.post('/', topos.postTopo)
router.get('/:topoSlug', topos.getTopo)

export default router;
