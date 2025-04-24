import { useState } from "react";
import { confirmUserAccount } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";
import { notifySuccess, notifyError } from "../../services/notificationService"; // Importar notificaciones

export const useConfirm = () => {
  const [confirmationCode, setConfirmationCode] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleConfirm = async (username: string) => {
    setLoading(true); 
    try {
      await confirmUserAccount(username, confirmationCode);
      notifySuccess("Cuenta confirmada correctamente.");  // Notificación de éxito
      setConfirmationCode(""); 
      navigate("/login"); 
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message;
      notifyError(errorMessage); // Notificación de error
      setConfirmationCode("");
      navigate("/login"); 
      console.error("Error al confirmar:", errorMessage);
    } finally {
      setLoading(false); 
    }
  };
  
  

  return {
    confirmationCode,
    setConfirmationCode,
    handleConfirm,
    loading,
  };
};
