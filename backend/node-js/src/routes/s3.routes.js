const { Router } = require('express');

const router = Router();
const { uploadPhoto, uploadVideo, uploadAudio, uploadDocument } = require('../controllers/s3.controller')

router.post('/upload-photo', uploadPhoto);
router.post('/upload-video', uploadVideo);
router.post('/upload-audio', uploadAudio);
router.post('/upload-document', uploadDocument);

module.exports =  router;