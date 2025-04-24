import * as dotenv from "dotenv";
import * as AWS from "aws-sdk";
import { Request, Response } from "express";
import { findFileById, getFile } from "../services/file.service";
import { createTranscription } from "./../services/transcription.service";

dotenv.config();

const rekognition = new AWS.Rekognition({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME as string;

export const extractTextFromImage = async (req: Request, res: Response): Promise<void> => {
    const { file_id, language } = req.body;

    try {
        const file = await getFile(file_id);
        if (!file) {
            res.status(404).json({ error: 'File not found' });
            return;
        }

        const imageUrl = file.s3_path;
        const imageKey = new URL(imageUrl).pathname.substring(1);

        const textDetections = await getTextFromImage(imageKey);

        // Crear contenido del archivo .txt con el texto extraído
        const timestamp = new Date().getTime();
        const content = textDetections.join('\n');
        const textFileName = `transcriptions/${file.file_name}_${timestamp}.txt`;

        // Subir el archivo .txt a S3 y obtener la URL
        const textFileUrl = await uploadTextToS3(textFileName, content);

        // Crear una transcripción con la URL del archivo de texto
        const transcription = await createTranscription(file_id, textFileUrl, language);

        res.status(200).json({ message: 'Text extracted successfully', textDetections, textFileUrl, transcription });
        return;
    } catch (error) {
        console.error('Error:', error);
        res.status(400).json({ error: (error as Error).message });
        return;
    }
};

async function getTextFromImage(imageKey: string): Promise<string[]> {
    const params: AWS.Rekognition.DetectTextRequest = {
        Image: {
            S3Object: {
                Bucket: BUCKET_NAME,
                Name: imageKey,
            },
        },
    };

    const data = await rekognition.detectText(params).promise();

    const uniqueLines = new Set<string>();

    if (data.TextDetections) {
        data.TextDetections.forEach(detection => {
            if (detection.Type === "LINE" && detection.DetectedText) {
                uniqueLines.add(detection.DetectedText);
            }
        });
    }

    return Array.from(uniqueLines);
}

async function uploadTextToS3(key: string, content: string): Promise<string> {
    const validContent = content || ''; 

    const params: AWS.S3.PutObjectRequest = {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: validContent,
        ContentType: 'text/plain',
    };

    await s3.upload(params).promise();

    // Retornar la URL del archivo en S3
    return `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
}
