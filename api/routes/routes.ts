import * as yup from "yup";
import express from "express";

import { routes } from "../controllers";
import { requireAuth, optionalAuth } from "../middleware/auth";
import { NewRouteScheme } from "../../core/schemas";
import { validateBody } from "../middleware/validate";

const route = express.Router();
const newRouteSchema = NewRouteScheme(yup);

route.post("/", requireAuth, validateBody(newRouteSchema), routes.postRoute);
route.get("/", optionalAuth, routes.getRoute);

export default route;
