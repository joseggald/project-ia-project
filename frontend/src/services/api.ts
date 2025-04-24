import axios from "axios";

const API_BASE_URL = import.meta.env.API_BACKEND_URL;
const API_BASE_URL_IA = import.meta.env.API_BASE_URL_IA;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api_ia = axios.create({
  baseURL: API_BASE_URL_IA,
  headers: {
    "Content-Type": "application/json",
  },
});

