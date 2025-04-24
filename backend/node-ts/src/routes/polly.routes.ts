import { Router } from "express";
import { createAudioReading, getAudioReadingsByTranscription } from "./../controllers/polly.controller";

const router = Router();

router.post("/create-audio-reading", createAudioReading);
router.get("/get-audio-readings/:transcription_id", getAudioReadingsByTranscription);

module.exports = router;