import express from "express";
import { users } from "../controllers";
import { optionalAuth } from "../middleware/auth";

const router = express.Router();

router.get("/:userSub/logs", optionalAuth, users.getUserLogs);

export default router;
