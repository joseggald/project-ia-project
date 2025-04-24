import { Router } from "express";
import {
  extractTextAudioVideo
} from "../controllers/ia.controller";

const router = Router();

router.post("/extract-text-audio-video", extractTextAudioVideo);

module.exports = router;