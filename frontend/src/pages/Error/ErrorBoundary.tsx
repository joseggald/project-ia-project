// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo } from "react";
import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error captured:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
          <div className="max-w-lg text-center p-6 bg-white shadow-xl rounded-lg">
            <Typography variant="h3" className="text-red-600 font-bold">
              ¡Oh no! Algo salió mal.
            </Typography>
            <Typography variant="body1" className="mt-4 text-gray-600">
              Parece que ocurrió un error inesperado. Por favor, intenta nuevamente o vuelve al inicio.
            </Typography>

            {/* Imagen de error */}
            <img
              src="https://via.placeholder.com/300x200" 
              alt="Error" 
              className="w-full mt-6 object-cover rounded-lg shadow-md"
            />

            <div className="flex justify-center mt-6 gap-4">
              {/* Botón para recargar */}
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={this.handleRetry}
                className="bg-blue-600 hover:bg-blue-700 transition"
              >
                Reintentar
              </Button>

              {/* Botón para volver al Dashboard */}
              <Button
                component={Link}
                to="/dashboard/audios"
                variant="outlined"
                size="large"
                className="border-blue-600 text-blue-600 hover:bg-blue-100"
              >
                Volver al inicio
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
