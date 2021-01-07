import express from "express";
import { users } from "../controllers";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

router.get("/logs", requireAuth, users.getProfileLogs);

export default router;
