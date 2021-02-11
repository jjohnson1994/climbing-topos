import * as yup from "yup";
import express from 'express';
import { topos } from "../controllers";
import { requireAuth, optionalAuth } from '../middleware/auth';
import { NewTopoSchema } from "../../core/schemas";
import { validateBody } from "../middleware/validate";

const router = express.Router();
const newTopoSchema = NewTopoSchema(yup);

router.post('/', requireAuth, validateBody(newTopoSchema), topos.postTopo)
router.get('/:topoSlug', optionalAuth, topos.getTopo)

export default router;
