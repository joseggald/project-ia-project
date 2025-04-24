import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2", dark: "#115293" },
    success: { main: "#2e7d32", dark: "#1b5e20" },
    error: { main: "#d32f2f", dark: "#c62828" },
    warning: { main: "#f9a825", dark: "#f57f17" },
    background: { default: "#f4f6f8", paper: "#ffffff" },
    text: { primary: "#333333", secondary: "#ffffff" },
  },
  typography: {
    fontFamily: ["SUSE", "Helvetica", "Arial", "sans-serif"].join(","),
    button: { textTransform: "none", fontWeight: 600 },
  },
});

export default theme;
