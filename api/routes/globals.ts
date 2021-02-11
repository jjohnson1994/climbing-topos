import express from "express";
import { optionalAuth } from "../middleware/auth";
import { globals } from "../controllers";

const router = express.Router();

router.get("/", optionalAuth, globals.getGlobals);

export default router;
