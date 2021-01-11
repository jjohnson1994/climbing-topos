import * as yup from "yup";
import express from "express";

import { routes } from "../controllers";
import { requireAuth, optionalAuth } from "../middleware/auth";
import { NewRouteScheme } from "../../core/schemas";
import { validateBody } from "../middleware/validate";
import { topos } from "../models";

const route = express.Router();
const newRouteSchema = NewRouteScheme(yup);

async function ensureTopoExists(req, res, next) {
  try {
    const { cragSlug, areaSlug, topoSlug } = req.body;
    const topo = topos.getTopo(cragSlug, areaSlug, topoSlug);

    if (topo) {
      next();
    } else {
      res.status(400).json({ error: true });
    }
  } catch (error) {
    res.status(500).json({ errror: true });
  }
}

route.post("/", requireAuth, validateBody(newRouteSchema), ensureTopoExists, routes.postRoute);
route.get("/", optionalAuth, routes.getRoute);

export default route;
