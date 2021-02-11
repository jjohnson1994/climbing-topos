import express from "express";
import { users } from "../controllers";
import { optionalAuth, requireAuth } from "../middleware/auth";

const router = express.Router();

router.post("/login", requireAuth, users.login);
router.get("/:userSub/logs", optionalAuth, users.getUserLogs);

export default router;
