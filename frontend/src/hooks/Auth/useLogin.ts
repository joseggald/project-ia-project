import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";
import { notifySuccess, notifyError } from "../../services/notificationService"; 

export const useLogin = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isConfirmRequired, setIsConfirmRequired] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { token } = await loginUser(username, password);
      login(token, username); // Guarda el token en localStorage y redirige
      notifySuccess("Inicio de sesión exitoso.");
      setError(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Error inesperado.";
      if (errorMessage.includes("Error logging in user: User is not confirmed.")) {
        setIsConfirmRequired(true);
      }
      notifyError(errorMessage);
      setError(errorMessage);
    }
  };

  const handleRegister = async (
    e: React.FormEvent,
    name: string,
    lastName: string,
    email: string,
    username: string,
    password: string
  ) => {
    e.preventDefault();
    try {
      await registerUser(name, lastName, username, email, password);
      notifySuccess("Usuario registrado correctamente.");
      navigate("/login"); // Redirige al login después del registro
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al registrar.");
    }
  };

  const handleCloseConfirmationCode = () => {
    setIsConfirmRequired(false);
    setError(null);
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    handleLogin,
    handleRegister,
    error,
    isConfirmRequired,
    handleCloseConfirmationCode
  };
};
