// src/api.ts
import axios from "axios";
import { useToken } from "./contexts/TokenContext";

// URL del backend
const BACKEND_URL = "http://198.211.105.95:8080";

/* -------------------- TIPOS -------------------- */

// Entrada común para login y registro
type AuthInput = {
  email: string;
  passwd: string; // importante: es "passwd", no "password"
};

// Respuesta del backend para login
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
      // ✅ no necesitas guardar 'response'
      await axios.post(`${BACKEND_URL}/authentication/register`, user);

      return { success: true };
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
    } catch (error) {
      return { success: false, error: "Usuario o contraseña incorrecta" };
    }
  };

  return { login };
}

/* -------------------- DASHBOARD -------------------- */

export function useExpensesSummary() {
  const fetchSummary = async (token: string) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/expenses_summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return { success: true, data: res.data };
    } catch (error: any) {
      console.error("Error al obtener resumen:", error);
      return {
        success: false,
        error: error?.response?.data?.message || "Error al obtener resumen",
      };
    }
  };

  return { fetchSummary };
}
