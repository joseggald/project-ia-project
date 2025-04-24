import { toast } from "react-toastify";

export const notifySuccess = (message: string) => {
  toast.success(message, { position: "top-center", autoClose: 3000 });
};

export const notifyError = (message: string) => {
  toast.error(message, { position: "top-center", autoClose: 3000 });
};