// src/pages/Auth/Register.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { Box, Typography, Paper, Grid, IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Image1 from "../../assets/images/1.jpg";
import Image2 from "../../assets/images/2.jpg";
import Image3 from "../../assets/images/3.jpg";
import Logo from "../../assets/images/logo.png";
import { useLogin } from "../../hooks/Auth/useLogin";

const Register: React.FC = () => {
  const { handleRegister, error } = useLogin();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    await handleRegister(e, name, lastName, email, username, password);
    navigate("/login");
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ position: "relative", overflow: "hidden", bgcolor: "rgba(0, 0, 0, 0.7)" }}>
      <Carousel autoPlay infiniteLoop showThumbs={false} showArrows={false} interval={5000}>
        {[Image1, Image2, Image3].map((img, index) => (
          <div key={index} style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
            <img src={img} alt={`Fondo ${index + 1}`} style={{ width: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backdropFilter: "blur(8px)" }} />
          </div>
        ))}
      </Carousel>

      <Paper elevation={8} sx={{ maxWidth: 600, padding: 4, borderRadius: 3, position: "absolute", backdropFilter: "blur(10px)" }}>
        <Typography variant="h5" align="center" sx={{ mb: 2 }}>Regístrate</Typography>

        <form onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <CustomInput label="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
            </Grid>
            <Grid item xs={6}>
              <CustomInput label="Apellido" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <CustomInput label="Correo" icon={EmailIcon} value={email} onChange={(e) => setEmail(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <CustomInput label="Nombre de Usuario" icon={AccountCircleIcon} value={username} onChange={(e) => setUsername(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <CustomInput label="Contraseña" type="password" icon={LockIcon} value={password} onChange={(e) => setPassword(e.target.value)} />
            </Grid>
          </Grid>

          {error && <Typography variant="body2" color="error" sx={{ mt: 1 }}>{error}</Typography>}

          <CustomButton sizeVariant="medium" colorVariant="primary" fullWidth sx={{ mt: 2 }} type="submit">Registrar</CustomButton>
        </form>

        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Typography variant="body2" sx={{ color: "#999" }}>¿Ya tienes cuenta?</Typography>
          <IconButton onClick={() => navigate("/login")}><ArrowBackIcon /></IconButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;
