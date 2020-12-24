import express from "express";

import { routes } from "../controllers";

const route = express.Router();

route.post("/", routes.postRoute);
route.get("/:routeSlug/", routes.getRoute);

export default route;
