
require("dotenv").config();
const axios=require("axios");
const aws = require("aws-sdk");
const { getFile } = require("../services/file.service");
const { createTranscription } = require("./../services/transcription.service");

const s3 = new aws.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const URL_API_GATEWAY_IA = process.env.URL_API_GATEWAY_IA;


exports.extractTextAudioVideo = async (req, res) => {
  const { file_id, language } = req.body;

  try {
      const file = await getFile(file_id);
      const audioVideoUrl = file.s3_path;
      const timestamp = new Date().getTime();
      const textDetections = await getTextFromAudioVideo(audioVideoUrl);

      if (!textDetections) {
          return res.status(500).json({ message: "Failed to extract text from audio/video" });
      }

      // Si `textDetections` es un string, úsalo directamente.
      // Si es un array, únelo en una cadena.
      const content = Array.isArray(textDetections) ? textDetections.join('\n') : textDetections;
      
      const textFileName = `transcriptions/${file.file_name}_${timestamp}.txt`;

      // Sube el archivo de texto a S3 y obtén la URL
      const textFileUrl = await uploadTextToS3(textFileName, content);

      // Crea el registro de la transcripción con la URL del archivo de texto
      const transcription = await createTranscription(file_id, textFileUrl, language);

      res.status(200).json({ message: 'Text extracted successfully', textFileUrl: textFileUrl, transcription });
  } catch (error) {
      console.error('Error:', error);
      res.status(400).json({ error: error.message });
  }
}

async function getTextFromAudioVideo(audioVideoUrl) {
  try {
      const response = await axios.post(URL_API_GATEWAY_IA + "transcription", {
          s3_url: audioVideoUrl
      });

      // Verifica la estructura de la respuesta para asegurarte de que contiene la transcripción.
      if (response.data && response.data.body && response.data.body.transcription) {
          return response.data.body.transcription;  // Puede ser un string
      } else {
          console.error('Unexpected response structure:', response.data);
          throw new Error('Transcription data not found in response');
      }
  } catch (error) {
      console.error('Error in getTextFromAudioVideo:', error.response ? error.response.data : error.message);
      throw error;
  }
}

async function uploadTextToS3(key, content) {
  const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: content,
      ContentType: 'text/plain',
  };

  await s3.upload(params).promise();

  // Retornar la URL del archivo en S3
  return `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
}