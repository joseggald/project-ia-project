const { Router } = require('express');
const { extractTextFromImage } = require('../controllers/rekognition.controller');

const router = Router();

router.post('/extract-text-from-image', extractTextFromImage);

module.exports = router;