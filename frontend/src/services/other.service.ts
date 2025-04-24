import { api } from "./api";
import { api_ia } from "./api";
//Translate Service
export const translateTextFromFile = (fileId: string | number, targetLanguage: string) => {
  return api.post("/translate/translate-text-from-file", {
    file_id: fileId,
    targetLanguage,
  });
};

export const getTranslation = (id_transcription: string | number) => {
  return api.get(`/translate/get-translations-transcription/${id_transcription}`);
}

// Polly Service
export const createAudioReading = (transcription_id:number|string, transcriptionUrl:string, language:string, file_name:string) => {
  return api.post("/polly/create-audio-reading", { transcription_id, transcriptionUrl, language, file_name });
};

export const getAudioReadingsByTranscription = (transcription_id:number|string) => {
  return api.get(`/polly/get-audio-readings/${transcription_id}`);
};

// Rekognition Service
export const extractTextFromImage = (fileId:number|string, language:string) => {
  return api.post("/rekognition/extract-text-from-image", { file_id: fileId, language });
};

// IA Service
export const extractTextFromAudioVideo = (fileId:number|string, language:string) => {
  return api.post("/ia/extract-text-audio-video", { file_id: fileId, language });
};

export const generateSummary = (s3_url:string) => {
  const response = api_ia.post("/generateSummary", { s3_url });
  console.log(response);
  return response;
}

