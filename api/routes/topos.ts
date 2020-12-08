import express from 'express';
import multer from "multer";
import { topos } from "../controllers";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post('/', upload.single("image"), topos.postTopo)

export default router;
