import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

interface AuthContextProps {
  user: { username: string } | null;
  login: (token: string,username:string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true); // Control de carga
  const navigate = useNavigate();

  const logout = React.useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login", { replace: true });
  }, [navigate]);

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await api.post("/users/verifySession", { token });
          if (response.status === 200) {
            const username=localStorage.getItem("username");
            setUser({ username: username || "" }); // Simula usuario autenticado
          } else {
            logout(); // Cierra sesión si la verificación falla
          }
        } catch (error) {
          console.error("Error verificando sesión:", error);
          logout();
        }
      }
      setLoading(false); // Finaliza la carga
    };

    verifySession();
  }, [logout, user?.username]); // Solo se ejecuta al montar

  const login = (token: string, username:string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    setUser({ username: username });
    navigate("/dashboard/upload-files", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  return context;
};
