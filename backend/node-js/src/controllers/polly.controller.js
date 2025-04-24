require("dotenv").config();
const aws = require("aws-sdk");
const { createPolly, getAudiosByTranscriptionId } = require('./../services/polly.service');

const polly = new aws.Polly({ region: process.env.AWS_REGION });

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const AUDIO_READINGS_FOLDER = 'audio_readings/';

exports.getAudioReadings = async (req, res) => {
    const { transcription_id } = req.params;

    try {
        const audioReadings = await getAudiosByTranscriptionId(transcription_id);
        if (audioReadings) {
            res.status(200).json({ audioReadings });
        } else {
            res.status(404).json({ message: 'Audio readings not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.createAudioReading = async (req, res) => {
    const { transcriptionUrl, transcription_id, language, file_name  } = req.body;

    try {
        const transcriptionKey = new URL(transcriptionUrl).pathname.substring(1);
        console.log('Transcription Key:', transcriptionKey);

        const text = await getTextFromS3(transcriptionKey);
        const audioStream = await synthesizeLongSpeech(text, language);

        const timestamp = new Date().getTime();
        const audioKey = `${AUDIO_READINGS_FOLDER}${file_name}_${timestamp}.mp3`;
        await uploadToS3(audioKey, audioStream);
        const audioUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${audioKey}`;

        await createPolly(parseInt(transcription_id), audioUrl, language);

        res.status(200).json({ message: 'Audio reading created successfully', audioUrl });
    } catch (error) {
        console.error('Error:', error);
        res.status(400).json({ error: error.message });
    }
};

async function getTextFromS3(key) {
    const params = {
        Bucket: BUCKET_NAME,
        Key: key,
    };
    console.log('Getting text from S3 with params:', params);

    const data = await s3.getObject(params).promise();
    return data.Body.toString('utf-8');
}

async function synthesizeLongSpeech(text, language) {
    const MAX_LENGTH = 1500; // Polly tiene un límite de 3000 caracteres, usamos 1500 para estar seguros
    let segments = [];
    
    // Dividir el texto en segmentos
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

    // Sintetizar cada segmento
    let audioStreams = await Promise.all(segments.map(segment => synthesizeSpeech(segment, language)));

    // Combinar los streams de audio
    return Buffer.concat(audioStreams);
}

async function synthesizeSpeech(text, language) {
    let voiceId;

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

    const params = {
        Text: text,
        OutputFormat: 'mp3',
        VoiceId: voiceId,
    };

    const data = await polly.synthesizeSpeech(params).promise();
    return data.AudioStream;
}

async function uploadToS3(key, audioStream) {
    const params = {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: audioStream,
        ContentType: 'audio/mpeg',
    };

    await s3.upload(params).promise();
}