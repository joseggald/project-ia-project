// src/pages/Dashboard/Images.tsx
import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import MediaCard from "../../components/MediaCard";
import { getFilesByUserIdAndFileType } from "../../services/file.service";
import { notifyError } from "../../services/notificationService";

const Images: React.FC = () => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        notifyError("No se encontró el token de usuario.");
        return;
      }

      try {
        const response = await getFilesByUserIdAndFileType(token, "image");
        setImages(response.data.files);
        setLoading(false);
      } catch (error) {
        notifyError("Error al obtener las imágenes.");
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Imágenes
      </Typography>
      <Grid container spacing={2}>
        {images.map((image, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <MediaCard
              title={image.file_name}
              format={image.file_type}
              date={image.uploaded_at}
              mediaUrl={image.s3_path}
              transcriptionUrl={image.transcription_content}
              transcriptionId={image.transcription_id}
              type="image"
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Images;
