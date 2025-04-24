import React, { useState } from "react";
import { Card, CardMedia, CardContent, Typography, Box, IconButton, Button, Modal, Fade } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import VideocamIcon from "@mui/icons-material/Videocam";
import CustomModal from "./CustomModal";

interface MediaCardProps {
  title: string;
  format: string;
  type: "video" | "image" | "audio";
  date: string;
  mediaUrl: string;
  transcriptionUrl: string;
  transcriptionId: number | string;
}

const MediaCard: React.FC<MediaCardProps> = ({
  title,
  format,
  type,
  date,
  mediaUrl,
  transcriptionUrl,
  transcriptionId,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [viewOriginal, setViewOriginal] = useState(false);

  const handleViewOriginal = () => {
    setViewOriginal(true);
  };

  return (
    <>
      <Card
        sx={{
          maxWidth: 345,
          borderRadius: "16px",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
          transition: "transform 0.2s ease-in-out",
          "&:hover": { transform: "scale(1.05)" },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <CardMedia
          component="div"
          sx={{
            height: 160,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f0f0f0",
          }}
        >
          {type === "image" ? (
            <img src={mediaUrl} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "16px 16px 0 0" }} />
          ) : type === "audio" ? (
            <AudiotrackIcon sx={{ fontSize: 80, color: "#757575" }} /> // Icono de audio
          ) : (
            <VideocamIcon sx={{ fontSize: 80, color: "#757575" }} /> // Icono de video
          )}
        </CardMedia>

        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600, mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {format.toUpperCase()} - {new Date(date).toLocaleDateString()}
          </Typography>
        </CardContent>

        <Box sx={{ position: "absolute", top: 8, right: 8, background: "#fff", borderRadius: 2 }}>
          <IconButton onClick={() => setOpenModal(true)}>
            <Visibility sx={{ color: "#333" }} />
          </IconButton>
        </Box>

        {/* Botón para ver solo el contenido original */}
        <Button
          onClick={handleViewOriginal}
          sx={{
            mt: 1,
            color: "#1976d2",
            fontWeight: "bold",
            textTransform: "none",
            fontSize: "0.9rem",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Ver Original
        </Button>
      </Card>

      {/* Modal con transcripciones y traducciones */}
      <CustomModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        transcriptionUrl={transcriptionUrl}
        transcription_id={transcriptionId}
        type={type}
        title={title}
      />

      {/* Modal para mostrar solo el contenido original */}
      {viewOriginal && (
        <Modal open={viewOriginal} onClose={() => setViewOriginal(false)}>
          <Fade in={viewOriginal}>
            <Box
              sx={{
                width: "85%",
                maxWidth: "800px",
                margin: "auto",
                mt: "5%",
                p: 4,
                backgroundColor: "white",
                borderRadius: "16px",
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
              }}
            >
              {type === "image" ? (
                <img src={mediaUrl} alt={title} style={{ width: "100%", objectFit: "contain", borderRadius: "16px" }} />
              ) : type === "video" ? (
                <video src={mediaUrl} controls style={{ width: "100%", height: "auto", borderRadius: "16px" }} />
              ) : (
                <audio src={mediaUrl} controls style={{ width: "100%", borderRadius: "16px" }} />
              )}
            </Box>
          </Fade>
        </Modal>
      )}
    </>
  );
};

export default MediaCard;
