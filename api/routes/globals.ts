import express from "express";
import { globals } from "../controllers";
import { optionalAuth } from "../middleware/auth";

const router = express.Router();

router.get('/', optionalAuth, globals.getGlobals);

export default router;
