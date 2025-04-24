import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import aws from "aws-sdk";
import { getFile } from "../services/file.service";
import { createTranscription } from "./../services/transcription.service";

const s3 = new aws.S3({
    region: process.env.AWS_REGION!,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME!;
const URL_API_GATEWAY_IA = process.env.URL_API_GATEWAY_IA!;

interface ExtractTextAudioVideoRequest {
    body: {
        file_id: string;
        language: string;
    };
}

interface ExtractTextAudioVideoResponse {
    status: (statusCode: number) => ExtractTextAudioVideoResponse;
    json: (body: Record<string, any>) => void;
}

export const extractTextAudioVideo = async (req: ExtractTextAudioVideoRequest, res: ExtractTextAudioVideoResponse) => {
    const { file_id, language } = req.body;

    try {
        const file = await getFile(Number(file_id));
        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }
        const audioVideoUrl = file.s3_path;
        const timestamp = new Date().getTime();
        const textDetections = await getTextFromAudioVideo(audioVideoUrl);

        if (!textDetections) {
            return res.status(500).json({ message: "Failed to extract text from audio/video" });
        }

        const content = Array.isArray(textDetections) ? textDetections.join('\n') : textDetections;
        const textFileName = `transcriptions/${file.file_name}_${timestamp}.txt`;

        const textFileUrl = await uploadTextToS3(textFileName, content);

        const transcription= await createTranscription(Number(file_id), textFileUrl, language);

        res.status(200).json({ message: 'Text extracted successfully', textFileUrl: textFileUrl, transcription });
    } catch (error: any) {
        console.error('Error:', error);
        res.status(400).json({ error: error.message });
    }
};

async function getTextFromAudioVideo(audioVideoUrl: string): Promise<string | string[]> {
    try {
        const response = await axios.post(`${URL_API_GATEWAY_IA}transcription`, {
            s3_url: audioVideoUrl,
        });

        if (response.data && response.data.body && response.data.body.transcription) {
            return response.data.body.transcription;
        } else {
            console.error('Unexpected response structure:', response.data);
            throw new Error('Transcription data not found in response');
        }
    } catch (error: any) {
        console.error('Error in getTextFromAudioVideo:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function uploadTextToS3(key: string, content: string): Promise<string> {
    const params: aws.S3.PutObjectRequest = {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: content,
        ContentType: 'text/plain',
    };

    await s3.upload(params).promise();

    return `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
}
