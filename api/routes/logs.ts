import * as yup from "yup";
import express from "express";

import { logs } from "../controllers";
import { requireAuth } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { NewLogsSchema } from "../../core/schemas";

const route = express.Router();
const newLogsSchema = NewLogsSchema(yup);

route.post("/", requireAuth, validateBody(newLogsSchema), logs.postLogs);

export default route;
