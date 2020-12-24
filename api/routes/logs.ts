import express from "express";

import { logs } from "../controllers";

const route = express.Router();

route.post("/", logs.postLogs);

export default route;
