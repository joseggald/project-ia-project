require("dotenv").config();
const aws = require("aws-sdk");
const { getFile } = require("../services/file.service");
const { findTranscriptionByFileId } = require("../services/transcription.service");
const { createTranslation, getTranslationTranscription } = require("../services/translation.service");

const s3 = new aws.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const translate = new aws.Translate({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

exports.getTranslations = async (req, res) => {
    const { transcription_id } = req.params;

    try {
        const translations = await getTranslationTranscription(Number(transcription_id));
        if (translations) {
            res.status(200).json({ translations });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.translateTextFromFile = async (req, res) => {
    const { file_id, targetLanguage } = req.body;

    try {
        // Obtener información del archivo
        const file = await getFile(file_id);
        const transcription = await findTranscriptionByFileId(file_id);
        console.log('Transcription:', transcription); // Para depuración
        const textFileUrl = transcription.content;

        // Extraer la clave de S3 de la URL
        const imageKey = new URL(textFileUrl).pathname.substring(1); // Obtener solo la clave

        // Obtener el contenido del archivo de texto desde S3
        const content = await getTextFileContent(imageKey);
        console.log('Contenido del archivo:', content); // Para depuración

        // Filtrar líneas vacías
        const lines = content.split('\n').filter(line => line.trim() !== '');

        // Comprobar si hay líneas para traducir
        if (lines.length === 0) {
            return res.status(400).json({ error: 'No hay texto para traducir.' });
        }

        // Traducir cada línea
        const translatedLines = await Promise.all(lines.map(line => translateText(line, targetLanguage)));

        // Unir las líneas traducidas
        const translatedText = translatedLines.join('\n');

        // Guardar el texto traducido en S3
        const timestamp = new Date().getTime();
        const translatedFileName = `translations/${file.file_name}_${timestamp}.txt`;
        const translatedFileUrl = await uploadTranslatedTextToS3(translatedFileName, translatedText);

        // Crear una nueva traducción en la base de datos
        await createTranslation(transcription.id, translatedFileUrl, targetLanguage);

        // Retornar la URL de la traducción
        res.status(200).json({ 
            message: 'Text translated successfully', 
            translatedText, 
            translatedFileUrl
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(400).json({ error: error.message });
    }
};

async function getTextFileContent(key) {
    const params = {
        Bucket: BUCKET_NAME,
        Key: key,
    };

    const data = await s3.getObject(params).promise();
    return data.Body.toString('utf-8'); 
}

async function translateText(text, targetLanguage) {
    const params = {
        Text: text,
        SourceLanguageCode: 'auto',
        TargetLanguageCode: targetLanguage,
    };

    const data = await translate.translateText(params).promise();
    return data.TranslatedText;
}

async function uploadTranslatedTextToS3(key, content) {
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
