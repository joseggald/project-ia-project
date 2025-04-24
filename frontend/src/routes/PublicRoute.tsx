import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <p>Cargando...</p>; // Mientras se verifica la sesión

  // Si está autenticado, redirige al dashboard.
  return isAuthenticated ? <Navigate to="/dashboard/audios" replace /> : <Outlet />;
};

export default PublicRoute;
