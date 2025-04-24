const { Router } = require('express');
const { translateTextFromFile, getTranslations } = require('../controllers/translate.controller');

const router = Router();

router.post('/translate-text-from-file', translateTextFromFile);
router.get("/get-translations-transcription/:transcription_id", getTranslations);

module.exports = router;