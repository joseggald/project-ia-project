import { Router } from "express";
import {
  translateTextFromFile,
  getTranslationsByTranscription
} from "../controllers/translate.controller";

const router = Router();

router.post("/translate-text-from-file", translateTextFromFile);
router.get("/get-translations-transcription/:transcription_id", getTranslationsByTranscription);

module.exports = router;
