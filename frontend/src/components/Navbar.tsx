import React, { useState, MouseEvent } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  Button,
} from "@mui/material";
import { Logout, Person } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/images/logo.png";
interface NavbarProps {
  username: string;
  avatarUrl?: string;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ username, avatarUrl, onLogout }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#333",
        padding: "8px 16px",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box display="flex" alignItems="center" gap="12px">
          <img src={Logo} alt="logo" style={{ width: 62, height: 62 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: "white" }}>
            Transcribe Master
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap="12px">
          <Typography variant="body1" sx={{ fontWeight: 500, color: "white" }}>
            {username}
          </Typography>
          <IconButton onClick={handleMenuOpen}>
            <Avatar src={avatarUrl || "/default-avatar.png"} sx={{ width: 40, height: 40 }} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <MenuItem onClick={onLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
