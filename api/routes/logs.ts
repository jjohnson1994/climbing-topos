import * as yup from "yup";
import express from "express";

import { logs } from "../controllers";
import { requireAuth } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { NewLogsSchema } from "../../core/schemas";
import { LogRequest, Route } from "../../core/types";
import { routes } from "../models";

const route = express.Router();
const newLogsSchema = NewLogsSchema(yup);

async function ensureRoutesExists(req, res, next) {
  const logRequests = req.body.logs as LogRequest[];
  const loggingRoutes: Route[] = await Promise.all(logRequests.map(
    log => routes.getRouteBySlug(
      log.cragSlug,
      log.areaSlug,
      log.topoSlug,
      log.routeSlug
    ))
  );

  const undefinedRoutes = loggingRoutes.filter(route => !route);

  if (undefinedRoutes.length === 0) {
    next();
  } else {
    res.status(400).send({ error: true });
  }
}

route.post("/", requireAuth, validateBody(newLogsSchema), ensureRoutesExists, logs.postLogs);

export default route;
