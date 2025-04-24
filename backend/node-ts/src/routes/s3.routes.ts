import { Router } from 'express';
import { uploadPhoto, uploadVideo, uploadAudio, uploadDocument } from '../controllers/s3.controller';

const router = Router();

router.post('/upload-photo', uploadPhoto);
router.post('/upload-video', uploadVideo);
router.post('/upload-audio', uploadAudio);
router.post('/upload-document', uploadDocument);

module.exports = router;
