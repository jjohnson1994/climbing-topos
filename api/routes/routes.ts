import express from "express";

import { routes } from "../controllers";
import { requireAuth, optionalAuth } from "../middleware/auth";

const route = express.Router();

route.post("/", requireAuth, routes.postRoute);
route.get("/:routeSlug/", optionalAuth, routes.getRoute);

export default route;
