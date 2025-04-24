import { api } from "./api";

const usersRoute = "/users";

// Servicio para Login
export const loginUser = async (username: string, password: string) => {
  const response = await api.post(`${usersRoute}/login`, { username, password });
  return response.data;
};

// Servicio para Registro
export const registerUser = async (
  name: string, 
  lastName: string, 
  username: string, 
  email: string, 
  password: string
) => {
  const response = await api.post(`${usersRoute}/register`, { 
    name, 
    last_name: lastName, 
    username, 
    email, 
    password 
  });
  return response.data;
};

// Servicio para Confirmación de Usuario
export const confirmUserAccount = async (username: string, confirmationCode: string) => {
  const response = await api.post(`${usersRoute}/confirm`, { 
    username, 
    confirmationCode 
  });
  return response.data;
};

