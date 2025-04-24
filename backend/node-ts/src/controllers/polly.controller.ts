import * as dotenv from "dotenv";
import * as AWS from "aws-sdk";
import { Request, Response } from "express";
import { createPolly, getAudioReadingsByTranscriptionId } from './../services/polly.service'

dotenv.config();

const polly = new AWS.Polly({ region: process.env.AWS_REGION });
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME as string;
const AUDIO_READINGS_FOLDER = 'audio_readings/';

export const getAudioReadingsByTranscription = async (req: Request, res: Response): Promise<void> => {
    const { transcription_id } = req.params;

    try {
        const audioReadings = await getAudioReadingsByTranscriptionId(parseInt(transcription_id));
        res.status(200).json({ audioReadings });
    } catch (error) {
        console.error('Error:', error);
        res.status(400).json({ error: (error as Error).message });
    }
}

export const createAudioReading = async (req: Request, res: Response): Promise<void> => {
    const { transcriptionUrl, transcription_id, language, file_name} = req.body;

    try {
        const transcriptionKey = new URL(transcriptionUrl).pathname.substring(1);

        const text = await getTextFromS3(transcriptionKey);
        const audioStream = await synthesizeLongSpeech(text, language);

        const timestamp = new Date().getTime();
        const audioKey = `${AUDIO_READINGS_FOLDER}${file_name}_${timestamp}.mp3`;
        await uploadToS3(audioKey, audioStream);
        const audioUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${audioKey}`;

        await createPolly(Number(transcription_id), audioUrl, language);

        res.status(200).json({ message: 'Audio reading created successfully', audioUrl });
    } catch (error) {
        console.error('Error:', error);
        res.status(400).json({ error: (error as Error).message });
    }
};

async function getTextFromS3(key: string): Promise<string> {
    const params: AWS.S3.GetObjectRequest = {
        Bucket: BUCKET_NAME,
        Key: key,
    };
    console.log('Getting text from S3 with params:', params);

    const data = await s3.getObject(params).promise();
    return data.Body?.toString('utf-8') || '';
}

async function synthesizeLongSpeech(text: string, language: string): Promise<Buffer> {
    const MAX_LENGTH = 1500;
    let segments: string[] = [];
    
    while (text.length > 0) {
        let segment = text.substring(0, MAX_LENGTH);
        let lastPeriod = segment.lastIndexOf('.');
        
        if (lastPeriod > 0) {
            segment = text.substring(0, lastPeriod + 1);
            text = text.substring(lastPeriod + 1);
        } else {
            text = text.substring(MAX_LENGTH);
        }
        
        segments.push(segment);
    }

    const audioStreams = await Promise.all(segments.map(segment => synthesizeSpeech(segment, language)));
    return Buffer.concat(audioStreams);
}

async function synthesizeSpeech(text: string, language: string): Promise<Buffer> {
    let voiceId: string;

    switch (language) {
        case 'es':
            voiceId = 'Lucia';
            break;
        case 'en':
            voiceId = 'Joanna';
            break;
        case 'fr':  
            voiceId = 'Celine';
            break;
        case 'it':
            voiceId = 'Carla';
            break;
        default:
            voiceId = 'Joanna';
    }

    const params: AWS.Polly.SynthesizeSpeechInput = {
        Text: text,
        OutputFormat: 'mp3',
        VoiceId: voiceId,
    };

    const data = await polly.synthesizeSpeech(params).promise();
    return data.AudioStream as Buffer;
}

async function uploadToS3(key: string, audioStream: Buffer): Promise<void> {
    const params: AWS.S3.PutObjectRequest = {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: audioStream,
        ContentType: 'audio/mpeg',
    };

    await s3.upload(params).promise();
}