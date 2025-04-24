import { useState } from "react";
import axios from "axios";
import { uploadPhoto, uploadVideo, uploadAudio } from "../../services/s3.service";
import { createFile } from "../../services/file.service";
import { extractTextFromImage, extractTextFromAudioVideo, translateTextFromFile, createAudioReading } from "../../services/other.service";
import { notifySuccess, notifyError } from "../../services/notificationService";
import { time } from "console";

export const useUploadFiles = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [fileType, setFileType] = useState<"image" | "video" | "audio">("image");
  const [file, setFile] = useState<File | null>(null);
  const [fileId, setFileId] = useState<number | string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [transcription, setTranscription] = useState<string>(""); // Texto de transcripción
  const [transcriptionIdPrincipal, setTranscriptionIdPrincipal] = useState<number | string | null>(null);
  const [textFileUrl, setTextFileUrl] = useState<string | null>(null); // URL del archivo txt
  const [language, setLanguage] = useState("es");
  const [audioUrls, setAudioUrls] = useState<any[]>([]); // URLs de audios generados
  const [translatedUrls, setTranslatedUrls] = useState<any[]>([]); // URLs de traducciones

  const handleFileTypeChange = (type: "image" | "video" | "audio") => {
    setFileType(type);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      notifyError("No hay archivo seleccionado.");
      return;
    }

    setProcessing(true);
    try {
      let uploadResponse;
      const token = localStorage.getItem("token") || "";
      if (fileType === "image") {
        uploadResponse = await uploadPhoto(token, file);
      } else if (fileType === "video") {
        uploadResponse = await uploadVideo(token, file);
      } else if (fileType === "audio") {
        uploadResponse = await uploadAudio(token, file);
      }

      const s3Path = uploadResponse?.data?.url;
      if (s3Path) {
        notifySuccess("Archivo subido con éxito.");
        const createFileResponse = await createFile(token, file.name, fileType, s3Path);
        setFileId(createFileResponse.data.file.id);
        setActiveStep((prev) => prev + 1);
      }
    } catch (error) {
      notifyError("Error durante la subida del archivo.");
    } finally {
      setProcessing(false);
    }
  };

  const handleProcessFile = async () => {
    if (!fileId) return;

    setProcessing(true);
    setActiveStep(3); // Nuevo paso para mostrar el loading de generación de traducciones y audios
    try {
      let result;
      if (fileType === "image") {
        result = await extractTextFromImage(fileId, language);
      } else if (fileType === "video" || fileType === "audio") {
        result = await extractTextFromAudioVideo(fileId, language);
      }

      const transcriptionContent = result?.data.textDetections || "Texto extraído.";
      const textFileUrl = result?.data.textFileUrl;
      localStorage.setItem("transcriptionId", result?.data?.transcription?.id);
      setTranscription(transcriptionContent);
      setTextFileUrl(textFileUrl);

      notifySuccess("Texto procesado exitosamente.");
      await new Promise(resolve => setTimeout(resolve, 3000));
      await handleTranslationsAndAudios(transcriptionContent, textFileUrl);

      setActiveStep((prev) => prev + 1); // Mover al paso de resultado final
    } catch (error) {
      notifyError("Error procesando el archivo.");
      setActiveStep(2); // Si falla, vuelve al paso de procesamiento
    } finally {
      setProcessing(false);
    }
  };

  const handleTranslationsAndAudios = async (transcriptionContent: string, textFileUrl: string) => {
    try {
      const translationsRequired = ["es", "en", "fr", "it"];
      const generatedTranslations = [];
      const transcriptionId = localStorage.getItem("transcriptionId");
      // Generar el audio para la transcripción original en su idioma
      if (transcriptionId) {
        const originalAudioResult = await createAudioReading(transcriptionId, textFileUrl, language, file?.name || "audio");
        setAudioUrls((prev) => [...prev, { language: language, url: originalAudioResult.data.audioUrl }]);
        generatedTranslations.push({
          language: language,
          url: textFileUrl,
        });
      } else {
        notifyError("Transcription ID is null.");
      } 

      for (const lang of translationsRequired.filter((lang) => lang !== language)) {
        const translationResult = await translateTextFromFile(fileId!, lang);
        generatedTranslations.push({
          language: lang,
          url: translationResult.data.translatedFileUrl,
        });
        // Crear lectura de audio con Polly
        const audioResult = await createAudioReading(transcriptionId!, translationResult.data.translatedFileUrl, lang, file?.name || "audio");
        setAudioUrls((prev) => [...prev, { language: lang, url: audioResult.data.audioUrl }]);
      }

      setTranslatedUrls(generatedTranslations);
    } catch (error) {
      notifyError("Error generando las traducciones o los audios.");
    }
  };

  const fetchTextFromUrl = async (url: string) => {
    try {
      const response = await axios.get(url, { responseType: 'text' });
      return response.data;
    } catch (error) {
      notifyError("Error obteniendo el contenido del archivo de texto.");
      return "";
    }
  };

  const resetProcess = () => {
    setActiveStep(0);
    setFile(null);
    setFileId(null);
    setTranscription("");
    setTextFileUrl(null);
    setAudioUrls([]);
    setTranslatedUrls([]);
    setLanguage("es");
  };

  return {
    activeStep,
    fileType,
    file,
    processing,
    transcription,
    textFileUrl,
    translatedUrls,
    audioUrls,
    language,
    handleFileTypeChange,
    handleLanguageChange,
    handleFileChange,
    handleUpload,
    handleProcessFile,
    resetProcess,
    setActiveStep,
    fetchTextFromUrl,
  };
};
