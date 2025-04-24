require("dotenv").config();
const aws = require("aws-sdk");
const { findFileById, getFile } = require("../services/file.service");
const { createTranscription } = require("./../services/transcription.service");

const rekognition = new aws.Rekognition({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new aws.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

exports.extractTextFromImage = async (req, res) => {
    const { file_id, language } = req.body;

    try {
        const file = await getFile(file_id);
        const imageUrl = file.s3_path;
        const timestamp = new Date().getTime();

        const imageKey = new URL(imageUrl).pathname.substring(1);
        console.log('Image Key:', imageKey);

        const textDetections = await getTextFromImage(imageKey);

        // Crear contenido del archivo .txt con el texto extraído
        const content = textDetections.join('\n');
        const textFileName = `transcriptions/${file.file_name}_${timestamp}.txt`;

        // Subir el archivo .txt a S3 y obtener la URL
        const textFileUrl = await uploadTextToS3(textFileName, content);

        // Crear una transcripción con la URL del archivo de texto
        const transcription = await createTranscription(file_id, textFileUrl, language);

        res.status(200).json({ message: 'Text extracted successfully', textDetections, textFileUrl, transcription });
    } catch (error) {
        console.error('Error:', error);
        res.status(400).json({ error: error.message });
    }
};

async function getTextFromImage(imageKey) {
    const params = {
        Image: {
            S3Object: {
                Bucket: BUCKET_NAME,
                Name: imageKey,
            },
        },
    };

    const data = await rekognition.detectText(params).promise();

    const uniqueLines = new Set();

    data.TextDetections.forEach(detection => {
        if (detection.Type === "LINE") {
            uniqueLines.add(detection.DetectedText);
        }
    });

    const extractedText = Array.from(uniqueLines);

    return extractedText;
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
