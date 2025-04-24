const { Router } = require("express");
const {
  extractTextAudioVideo
} = require("../controllers/ia.controller");

const router = Router();

router.post("/extract-text-audio-video", extractTextAudioVideo);


module.exports = router;