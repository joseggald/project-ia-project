import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import MediaCard from "../../components/MediaCard";
import { getFilesByUserIdAndFileType } from "../../services/file.service";
import { notifyError } from "../../services/notificationService";

const Videos: React.FC = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        notifyError("No se encontró el token de usuario.");
        return;
      }

      try {
        const response = await getFilesByUserIdAndFileType(token, "video");
        setVideos(response.data.files);
        setLoading(false);
      } catch (error) {
        notifyError("Error al obtener los videos.");
        setLoading(false);
      }
    };

    fetchVideos();
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
        Videos
      </Typography>
      <Grid container spacing={2}>
        {videos.map((video, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <MediaCard
              title={video.file_name}
              format={video.file_type}
              date={video.uploaded_at}
              mediaUrl={video.s3_path}
              transcriptionUrl={video.transcription_content}
              transcriptionId={video.transcription_id}
              type="video"
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Videos;
