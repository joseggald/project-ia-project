import { api } from "./api";

const usersRoute = "/users";

// Servicio para obtener un usuario por Token
export const getUserByToken = async (token: string) => {
    const response = await api.post(`${usersRoute}/getUserByToken`, { token });
    return response;
};