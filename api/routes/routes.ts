import express from "express";

import { routes } from "../controllers";

const route = express.Router();

route.post("/", routes.postRoute);

export default route;
