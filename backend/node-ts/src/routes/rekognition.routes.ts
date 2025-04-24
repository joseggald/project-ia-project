import { Router } from "express";
import { extractTextFromImage } from './../controllers/rekognition.controller';

const router = Router();

router.post('/extract-text-from-image', extractTextFromImage);

module.exports = router;