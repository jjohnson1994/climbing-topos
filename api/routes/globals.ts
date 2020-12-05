import express from "express";
import { globals } from "../controllers";

const router = express.Router();

router.get('/', globals.getGlobals);

export default router;
