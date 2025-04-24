const { Router } = require('express');
const { createAudioReading, getAudioReadings } = require('../controllers/polly.controller');

const router = Router();

router.post('/create-audio-reading', createAudioReading);
router.get('/get-audio-readings/:transcription_id', getAudioReadings);

module.exports = router;