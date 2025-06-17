// src/api.ts
import axios from "axios";
import { useToken } from "./contexts/TokenContext.tsx";
const BACKEND_URL = "http://198.211.105.95:8080";

/* -------------------- TIPOS -------------------- */


type AuthInput = {
  email: string;
  passwd: string; 
};

type AuthResponse = {
  status: number;
  message: string;
  result: {
    token: string;
    username: string;
  };
};

/* -------------------- REGISTRO -------------------- */

export function useSignup() {
  const signup = async (user: AuthInput) => {
    try {
      const response = await axios.post<AuthResponse>(
        `${BACKEND_URL}/authentication/register`,
        user
      );

      return {
        success: true,
        token: response.data.result.token,
        username: response.data.result.username,
      };
    } catch {
      return { success: false, error: "Error al registrar el usuario" };
    }
  };

  return { signup };
}

/* -------------------- LOGIN -------------------- */

export function useLogin() {
  const login = async (user: AuthInput) => {
    try {
      const response = await axios.post<AuthResponse>(
        `${BACKEND_URL}/authentication/login`,
        user
      );

      return {
        success: true,
        token: response.data.result.token,
        username: response.data.result.username,
      };
    } catch {
      return { success: false, error: "Usuario o contraseña incorrecta" };
    }
  };

  return { login };
}
