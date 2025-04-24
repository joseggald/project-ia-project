import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import MediaCard from "../../components/MediaCard";
import { getFilesByUserIdAndFileType } from "../../services/file.service";
import { notifyError } from "../../services/notificationService";

const Audios: React.FC = () => {
  const [audios, setAudios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAudios = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        notifyError("No se encontró el token de usuario.");
        return;
      }

      try {
        const response = await getFilesByUserIdAndFileType(token, "audio");
        setAudios(response.data.files);
        setLoading(false);
      } catch (error) {
        notifyError("Error al obtener los audios.");
        setLoading(false);
      }
    };

    fetchAudios();
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
        Audios
      </Typography>
      <Grid container spacing={2}>
        {audios.map((audio, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <MediaCard
              title={audio.file_name}
              format={audio.file_type}
              date={audio.uploaded_at}
              mediaUrl={audio.s3_path}
              transcriptionUrl={audio.transcription_content}
              transcriptionId={audio.transcription_id}
              type="audio"
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Audios;
