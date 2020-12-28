import express from "express";

import { uploads } from "../controllers";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

router.get("/pre-signed-upload-url/", requireAuth, uploads.getPreSignedUploadURL);

export default router;
