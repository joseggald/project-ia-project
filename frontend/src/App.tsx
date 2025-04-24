// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import DashboardLayout from "./layouts/DashboardLayout";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import { AuthProvider } from "./context/AuthContext";
import theme from "./providers/ThemeProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Audios from "./pages/Dashboard/Audios";
import Videos from "./pages/Dashboard/Videos";
import Images from "./pages/Dashboard/Images";
import UploadFiles from "./pages/Dashboard/UploadFiles";
import ErrorBoundary from "./pages/Error/ErrorBoundary"; 
const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <ErrorBoundary>
            <Routes>
              {/* Rutas públicas (Login y Register) */}
              <Route path="/" element={<PublicRoute />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route index element={<Navigate to="login" replace />} />
              </Route>

              {/* Rutas protegidas (Dashboard) */}
              <Route path="/dashboard" element={<PrivateRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="upload-files" element={<UploadFiles />} />
                  <Route path="audios" element={<Audios />} />
                  <Route path="videos" element={<Videos />} />
                  <Route path="imagenes" element={<Images />} />
                  <Route index element={<Navigate to="upload-files" replace />} />
                </Route>
              </Route>
              <Route path="*" element={<Navigate to="/dashboard/upload-files" replace />} />
            </Routes>
          </ErrorBoundary>
        </AuthProvider>
      </BrowserRouter>
      <ToastContainer />
    </ThemeProvider>
  );
};

export default App;
