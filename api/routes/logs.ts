import express from "express";

import { logs } from "../controllers";
import { requireAuth } from "../middleware/auth";

const route = express.Router();

route.post("/", requireAuth, logs.postLogs);

export default route;
