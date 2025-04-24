import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, IconButton, CircularProgress, Select, MenuItem, Button, Fade, Divider, SelectChangeEvent } from "@mui/material";
import { Close } from "@mui/icons-material";
import CustomTextArea from "./CustomTextArea";
import { notifyError } from "../services/notificationService";
import { getTranslation, getAudioReadingsByTranscription, generateSummary } from "../services/other.service";
import axios from "axios";

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  transcriptionUrl: string;
  transcription_id: number | string;
  type: "video" | "image" | "audio";
  title: string;
}

const CustomModal: React.FC<CustomModalProps> = ({
  open,
  onClose,
  transcriptionUrl,
  transcription_id,
  type,
  title,
}) => {
  const [transcription, setTranscription] = useState<string>("");
  const [translations, setTranslations] = useState<any[]>([]);
  const [audioReadings, setAudioReadings] = useState<any[]>([]);
  const [selectedTranslationUrl, setSelectedTranslationUrl] = useState<string | null>(null);
  const [selectedTranslationContent, setSelectedTranslationContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [showSummaryButton, setShowSummaryButton] = useState(false);
  const [openSummaryModal, setOpenSummaryModal] = useState(false);
  const [summary, setSummary] = useState<string>("");

  // Cargar la transcripción y las traducciones
  useEffect(() => {
    const fetchTranscriptionData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(transcriptionUrl, { responseType: 'text' });
        setTranscription(response.data);
        
        const translationsData = await getTranslation(transcription_id);
        const audioData = await getAudioReadingsByTranscription(transcription_id);

       
        if (Array.isArray(translationsData.data.translations)) {
          setTranslations([
            ...translationsData.data.translations,
            { translated_content: transcriptionUrl, target_language: "original" }
          ]);
        } else {
          // Si no es una matriz, solo guarda el original
          setTranslations([{ translated_content: transcriptionUrl, target_language: "original" }]);
        }
        setAudioReadings(audioData.data.audioReadings);
        setSelectedTranslationUrl(transcriptionUrl);

        if (response.data.length > 100) {
          setShowSummaryButton(true);
        }
      } catch (error) {
        notifyError("Error al obtener la transcripción o traducciones.");
      } finally {
        setLoading(false);
      }
    };

    if (transcriptionUrl) {
      fetchTranscriptionData();
    }
  }, [transcriptionUrl, transcription_id]);

  // Cargar el contenido de la traducción seleccionada
  const handleTranslationChange = async (event: SelectChangeEvent<any>) => {
    const selectedUrl = event.target.value as string;
    setSelectedTranslationUrl(selectedUrl);
    const response = await axios.get(selectedUrl, { responseType: 'text' });
    setSelectedTranslationContent(response.data);
  };

  // Generar resumen
  const handleGenerateSummary = async () => {
    setSummaryLoading(true);
    try {
      const summaryResponse = await generateSummary(transcriptionUrl);
      setSummary(summaryResponse.data.body.summary);
      setOpenSummaryModal(true);
    } catch (error) {
      notifyError("Error al generar el resumen.");
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Fade in={open}>
          <Box
            sx={{
              width: "90%",
              maxWidth: "800px",
              maxHeight: "85vh",
              margin: "auto",
              mt: "5%",
              p: 4,
              borderRadius: "16px",
              backgroundColor: "white",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
              gap: 3,
              position: "relative",
              animation: "fadeIn 0.5s ease",
              overflow: "hidden", // Evitar scroll externo
            }}
          >
            {/* Botón de cierre */}
            <IconButton onClick={onClose} sx={{ position: "absolute", top: 8, right: 8 }}>
              <Close />
            </IconButton>

            {/* Título del modal */}
            <Typography variant="h4" fontWeight="bold" textAlign="center">
              {title}
            </Typography>

            {/* Contenedor ajustable para el contenido principal */}
            <Box sx={{ flexGrow: 1, overflowY: "auto", pr: 2 }}> {/* Evitar scroll innecesario */}
              
              {/* Select para cambiar entre traducciones */}
              {translations.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ mt: 2 }}>Seleccionar Traducción:</Typography>
                  <Select
                    value={selectedTranslationUrl || translations[0].translated_content}
                    onChange={handleTranslationChange}
                    sx={{ width: "100%", borderRadius: "8px", mb: 2 }}
                  >
                    {translations.map((translation, index) => (
                      <MenuItem key={index} value={translation.translated_content}>
                        {translation.target_language.toUpperCase()}
                      </MenuItem>
                    ))}
                  </Select>
                </>
              )}

              {/* Área de transcripción o traducción */}
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px" }}>
                  <CircularProgress />
                </Box>
              ) : (
                <CustomTextArea
                  label="Transcripción"
                  value={selectedTranslationContent || transcription}
                  sizeVariant="large"
                  customHeight="160px"
                  disabled
                />
              )}

              {/* Botón para generar resumen si es necesario */}
              {showSummaryButton && (
                <Button onClick={handleGenerateSummary} disabled={summaryLoading} variant="contained" sx={{ mt: 2 }}>
                  {summaryLoading ? <CircularProgress size={24} /> : "Generar Resumen"}
                </Button>
              )}

              <Divider sx={{ my: 3 }} />

              {/* Mostrar audios generados */}
              {audioReadings.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ mt: 2 }}>Audios Generados:</Typography>
                  {audioReadings.map((audio, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="body1" sx={{ mb: 1 }}>{audio.voice.toUpperCase()}:</Typography>
                      <audio controls style={{ width: "100%", borderRadius: "16px" }}>
                        <source src={audio.audio_file} type="audio/mpeg" />
                        Tu navegador no soporta el elemento de audio.
                      </audio>
                    </Box>
                  ))}
                </>
              )}
            </Box>
          </Box>
        </Fade>
      </Modal>

      {/* Modal para el resumen */}
      <Modal open={openSummaryModal} onClose={() => setOpenSummaryModal(false)}>
        <Fade in={openSummaryModal}>
          <Box
            sx={{
              width: "85%",
              maxWidth: "800px",
              maxHeight: "80vh",
              margin: "auto",
              mt: "5%",
              p: 4,
              borderRadius: "16px",
              backgroundColor: "white",
              overflowY: "auto",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography variant="h5" fontWeight="bold" textAlign="center">
              Resumen Generado
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              {summary}
            </Typography>
            <Button onClick={() => setOpenSummaryModal(false)} variant="outlined" sx={{ mt: 4 }}>
              Cerrar
            </Button>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default CustomModal;
