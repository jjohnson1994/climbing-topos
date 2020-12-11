import express from "express";

import { uploads } from "../controllers";

const router = express.Router();

router.get("/pre-signed-upload-url/", uploads.getPreSignedUploadURL);

export default router;
