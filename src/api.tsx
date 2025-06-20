// src/api.tsx
import axios from "axios";

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

/* -------------------- CATEGORIES -------------------- */

export function useExpenseCategories() {
  const fetchCategories = async (token: string) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/expenses_category`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { success: true, data: res.data };
    } catch (err) {
      console.error("Error al obtener categorías:", err);
      return { success: false, error: "Error al obtener categorías" };
    }
  };
  return { fetchCategories };
}

/* -------------------- EXPENSE DETAILS -------------------- */

export function useExpenseDetails() {
  const fetchDetails = async (
    token: string,
    year: number,
    month: number,
    categoryId: number
  ) => {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/expenses/detail?year=${year}&month=${month}&categoryId=${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { success: true, data: res.data };
    } catch (err) {
      console.error("Error al obtener detalles:", err);
      return { success: false, error: "Error al obtener detalles" };
    }
  };

  return { fetchDetails };
}

/* -------------------- DELETE EXPENSE -------------------- */

export function useDeleteExpense() {
  const deleteExpense = async (token: string, expenseId: number) => {
    try {
      await axios.delete(`${BACKEND_URL}/expenses/${expenseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { success: true };
    } catch (err) {
      console.error("Error al eliminar gasto:", err);
      return { success: false, error: "Error al eliminar gasto" };
    }
  };

  return { deleteExpense };
}

/* -------------------- CREATE EXPENSE -------------------- */

export function useCreateExpense() {
  const createExpense = async (
    token: string,
    date: string,
    category: { id: number; name: string },
    amount: number
  ) => {
    try {
      await axios.post(
        `${BACKEND_URL}/expenses`,
        {
          date,
          category,
          amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { success: true };
    } catch (err) {
      console.error("Error al registrar gasto:", err);
      return { success: false, error: "Error al registrar gasto" };
    }
  };

  return { createExpense };
}