import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../hooks/Auth/useLogin";
import { useConfirm } from "../../hooks/Auth/useConfirm";
import { Box, Typography, Paper, Modal, IconButton, CircularProgress, Stack, TextField } from "@mui/material";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Logo from "../../assets/images/logo.png";
import Image1 from "../../assets/images/1.jpg";
import Image2 from "../../assets/images/2.jpg";
import Image3 from "../../assets/images/3.jpg";
import CloseIcon from "@mui/icons-material/Close";
const Login: React.FC = () => {
  const { username, setUsername, password, setPassword, handleLogin, error, isConfirmRequired, handleCloseConfirmationCode } = useLogin();
  const { confirmationCode, setConfirmationCode, handleConfirm, loading } = useConfirm();
  const navigate = useNavigate();

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);


  const handleChange = (index: number, value: string) => {
    if (/^\d$/.test(value)) {
      // Actualiza el dígito específico
      const newCode = confirmationCode.split("");
      newCode[index] = value;
      setConfirmationCode(newCode.join(""));

      // Mueve el foco al siguiente input automáticamente
      if (index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !confirmationCode[index] && index > 0) {
      // Mueve el foco al input anterior si se borra y está vacío
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ position: "relative", overflow: "hidden", bgcolor: "rgba(0, 0, 0, 0.7)" }}>
      {/* Carrusel de Fondo */}
      <Carousel autoPlay infiniteLoop showThumbs={false} showArrows={false}>
        {[Image1, Image2, Image3].map((img, index) => (
          <div key={index} style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
            <img src={img} alt={`Fondo ${index + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backdropFilter: "blur(8px)" }} />
          </div>
        ))}
      </Carousel>

      {/* Logo y Título */}
      <Box display="flex" alignItems="center" gap={2} sx={{ position: "absolute", top: "5%", left: "50%", transform: "translateX(-50%)", bgcolor: "rgba(0, 0, 0, 0.5)", borderRadius: 2, padding: 2 }}>
        <img src={Logo} alt="Logo" style={{ width: 50, height: 50 }} />
        <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>Transcribe Master</Typography>
      </Box>

      {/* Formulario de Login */}
      <Paper elevation={8} sx={{ maxWidth: 900, padding: 4, borderRadius: 3, position: "absolute", backdropFilter: "blur(10px)" }}>
        <Typography variant="h5" align="center" sx={{ mb: 2 }}>Iniciar Sesión</Typography>

        <form onSubmit={handleLogin}>
          <CustomInput label="Nombre de Usuario" icon={AccountCircleIcon} value={username} onChange={(e) => setUsername(e.target.value)} />
          <CustomInput label="Contraseña" type="password" icon={LockIcon} value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <Typography variant="body2" color="error" sx={{ mt: 1 }}>{error}</Typography>}
          <CustomButton sizeVariant="medium" colorVariant="primary" fullWidth sx={{ mt: 2 }} type="submit">Iniciar Sesión</CustomButton>
        </form>

        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Typography variant="body2" sx={{ color: "#999" }}>¿No tienes cuenta?</Typography>
          <IconButton onClick={() => navigate("/register")}><ArrowForwardIcon /></IconButton>
        </Box>
      </Paper>

      <Modal open={isConfirmRequired}>
        <Box sx={{ width: 400, padding: 4, borderRadius: 3, backgroundColor: "white", margin: "auto", mt: "10%", textAlign: "center", display: "flex", flexDirection: "column", gap: 2,position: "relative" }}>
        <IconButton
          onClick={() => handleCloseConfirmationCode()}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "red",
            backgroundColor: "#f0f0f0",
            width: 25,
            height: 25,
            "&:hover": {
              backgroundColor: "#ffe6e6", // Cambio de color en hover
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

          <Typography variant="h6">Confirmar Cuenta</Typography>

          <Stack direction="row" spacing={1} justifyContent="center">
            {Array.from({ length: 6 }).map((_, index) => (
              <TextField
                key={index}
                inputRef={(el) => (inputRefs.current[index] = el)}
                value={confirmationCode[index] || ""}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                inputProps={{ maxLength: 1, style: { textAlign: "center", fontSize: "1.5rem" } }}
                sx={{ width: 50 }}
              />
            ))}
          </Stack>


          <CustomButton sizeVariant="medium" colorVariant="success" onClick={() => handleConfirm(username)} disabled={loading} fullWidth sx={{ mt: 2 }}>
            {loading ? <CircularProgress size={24} /> : "Confirmar"}
          </CustomButton>
        </Box>
      </Modal>
    </Box>
  );
};

export default Login;
