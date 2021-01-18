import * as yup from "yup";
import express from 'express';
import { requireAuth } from '../middleware/auth';

import { lists } from "../controllers";
import { validateBody, validateQuery } from '../middleware/validate';
import { NewListSchema, UpdateListSchema } from '../../core/schemas';

const router = express.Router();
const newListSchema = NewListSchema(yup);
const updateListSchema = UpdateListSchema(yup);

router.get('/', requireAuth, lists.getLists);

router.post(
  '/', 
  requireAuth, 
  validateBody(newListSchema), 
  lists.postList,
);

router.patch(
  '/', 
  requireAuth, 
  validateBody(updateListSchema), 
  validateQuery(yup.object().shape({
    listSlug: yup.string().required()
  })), 
  lists.patchList
)

export default router;

