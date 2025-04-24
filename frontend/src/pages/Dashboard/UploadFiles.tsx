import React, { useState, useEffect } from "react";
import { Box, Typography, Select, MenuItem, Stepper, Step, StepLabel, CircularProgress, Button, Link, SelectChangeEvent } from "@mui/material";
import CustomButton from "../../components/CustomButton";
import CustomTextArea from "../../components/CustomTextArea";
import { useUploadFiles } from "../../hooks/Dashboard/useUploadFiles";

const steps = ["Seleccionar Tipo", "Subir Archivo", "Procesar Archivo", "Generando Traducciones y Audios", "Mostrar Resultado"];

const UploadFiles: React.FC = () => {
  const {
    activeStep,
    fileType,
    file,
    processing,
    transcription,
    textFileUrl, // URL del archivo txt
    audioUrls, // Audios generados
    translatedUrls, // Traducciones generadas
    language,
    handleFileTypeChange,
    handleLanguageChange,
    handleFileChange,
    handleUpload,
    handleProcessFile,
    resetProcess,
    fetchTextFromUrl, // Función para obtener contenido de las URL
    setActiveStep,
  } = useUploadFiles();

  const [selectedTranslation, setSelectedTranslation] = useState<string | null>(null); // Para manejar la traducción seleccionada
  const [selectedTranslationContent, setSelectedTranslationContent] = useState<string>(""); // Contenido de la traducción seleccionada
  const [selectedAudio, setSelectedAudio] = useState<string | null>(null); // Para manejar el audio seleccionado

  const handleTranslationChange = async (event: SelectChangeEvent<any>) => {
    const selectedUrl = event.target.value as string;
    setSelectedTranslation(selectedUrl);
    
    // Obtener el contenido de la traducción seleccionada
    const translationContent = await fetchTextFromUrl(selectedUrl);
    setSelectedTranslationContent(translationContent);
  };

  const handleAudioChange = (event: SelectChangeEvent<any>) => {
    setSelectedAudio(event.target.value as string);
  };

  useEffect(() => {
    if (translatedUrls.length > 0) {
      // Establecer la traducción original por defecto
      setSelectedTranslation(translatedUrls[0].url);
      fetchTextFromUrl(translatedUrls[0].url).then(setSelectedTranslationContent);
    }
    if (audioUrls.length > 0) {
      // Establecer el audio original por defecto
      setSelectedAudio(audioUrls[0].url);
    }
  }, [translatedUrls, audioUrls]);

  return (
    <Box sx={{ p: 4, maxWidth: "900px", margin: "0 auto", backgroundColor: "#f5f5f5", borderRadius: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
        Subida y Procesamiento de Archivos
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              sx={{
                "& .MuiStepLabel-label": {
                  color: activeStep === index ? "primary" : "black", // Paso activo en azul, el resto en negro
                  fontWeight: activeStep === index ? "bold" : "normal",
                  transition: "color 0.3s ease", // Transición suave al cambiar de paso
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Paso 0: Selección de tipo de archivo y lenguaje */}
      {activeStep === 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center" }}>
          <Typography variant="h6">Selecciona el tipo de archivo que deseas subir:</Typography>
          <Select
            value={fileType}
            onChange={(e) => handleFileTypeChange(e.target.value as "image" | "video" | "audio")}
            sx={{ width: "300px" }}
          >
            <MenuItem value="image">Imagen</MenuItem>
            <MenuItem value="video">Video</MenuItem>
            <MenuItem value="audio">Audio</MenuItem>
          </Select>

          <Select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value as string)}
            sx={{ width: "300px" }}
          >
            <MenuItem value="es">Español</MenuItem>
            <MenuItem value="en">Inglés</MenuItem>
            <MenuItem value="fr">Francés</MenuItem>
            <MenuItem value="it">Italiano</MenuItem>
          </Select>

          <CustomButton
            sizeVariant="large"
            colorVariant="primary"
            onClick={() => setActiveStep((prev) => prev + 1)}
          >
            Iniciar Subida
          </CustomButton>
        </Box>
      )}

      {/* Paso 1: Subida de archivo */}
      {activeStep === 1 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center" }}>
          <Typography variant="h6">Subir archivo ({fileType})</Typography>
          <input type="file" onChange={handleFileChange} />

          <CustomButton
            sizeVariant="large"
            colorVariant="primary"
            onClick={handleUpload}
            disabled={!file || processing}
          >
            {processing ? <CircularProgress size={24} /> : "Subir Archivo"}
          </CustomButton>

          <Button variant="text" onClick={() => setActiveStep(0)}>
            Cancelar
          </Button>
        </Box>
      )}

      {/* Paso 2: Procesar archivo */}
      {activeStep === 2 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center" }}>
          <Typography variant="h6">Procesar archivo</Typography>
          <CustomButton
            sizeVariant="large"
            colorVariant="primary"
            onClick={handleProcessFile}
            disabled={processing}
          >
            {processing ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CircularProgress size={24} sx={{ mr: 2 }} />
                Procesando...
              </Box>
            ) : (
              "Procesar Archivo"
            )}
          </CustomButton>
        </Box>
      )}

      {/* Paso 3: Generando Traducciones y Audios */}
      {activeStep === 3 && (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
          <CircularProgress size={40} />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Generando traducciones y audios, por favor espera...
          </Typography>
        </Box>
      )}

      {/* Paso 4: Mostrar resultado */}
      {activeStep === 4 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center" }}>
          <Typography variant="h6">Resultado</Typography>

          {/* Select para mostrar diferentes traducciones */}
          {translatedUrls.length > 0 && (
            <>
              <Typography variant="h6" sx={{ mt: 2 }}>Seleccionar traducción:</Typography>
              <Select
                value={selectedTranslation || translatedUrls[0].url}
                onChange={handleTranslationChange}
                sx={{ width: "300px" }}
              >
                {translatedUrls.map((translation, index) => (
                  <MenuItem key={index} value={translation.url}>
                    {translation.language.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>

              <CustomTextArea
                label="Traducción"
                value={selectedTranslationContent || transcription}
                sizeVariant="large"
                customHeight="160px"
                disabled
              />
            </>
          )}

          {/* Mostrar audios generados */}
          {audioUrls.length > 0 && (
            <>
              <Typography variant="h6" sx={{ mt: 2 }}>Lecturas de Audio Generadas:</Typography>
              {audioUrls.map((audio, index) => (
                <Box key={index} sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
                  <Typography variant="body1">{audio.language.toUpperCase()}:</Typography>
                  <audio controls>
                    <source src={audio.url} type="audio/mpeg" />
                    Tu navegador no soporta el elemento de audio.
                  </audio>
                </Box>
              ))}
            </>
          )}

          <CustomButton sizeVariant="large" colorVariant="primary" onClick={resetProcess}>
            Subir otro archivo
          </CustomButton>
        </Box>
      )}
    </Box>
  );
};

export default UploadFiles;
