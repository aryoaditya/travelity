import axios from "axios";
import { getToken } from "@/utils/auth";

export const http = axios.create({
  baseURL: "https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

http.interceptors.request.use((config) => {
  if (config.url?.includes("/auth/local")) {
    return config;
  }

  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
