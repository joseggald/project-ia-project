// src/layouts/DashboardLayout.tsx
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { VideoLibrary, Audiotrack, Image, FileOpen } from "@mui/icons-material";

const drawerWidth = 240;

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { label: "Subida de archivos", icon: <FileOpen />, path: "/dashboard/upload-files" },
    { label: "Audios", icon: <Audiotrack />, path: "/dashboard/audios" },
    { label: "Videos", icon: <VideoLibrary />, path: "/dashboard/videos" },
    { label: "Imágenes", icon: <Image />, path: "/dashboard/imagenes" },
  ];

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Navbar fijo en la parte superior */}
      <Navbar username={user?.username || "Usuario"} onLogout={handleLogout} />

      {/* Drawer en el costado izquierdo sin separación innecesaria */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            marginTop: 10,
          },
        }}
      >
        <List sx={{marginTop:"-10px"}}>
          {menuItems.map((item, index) => (
            <ListItemButton
              component="li"
              key={index}
              onClick={() => navigate(item.path)}
              selected={window.location.pathname === item.path}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "#f4f4f4",
                  "&:hover": { backgroundColor: "#e0e0e0" },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      {/* Contenido principal */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
