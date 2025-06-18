import { createContext, useContext, useState, type ReactNode } from "react";

// Define el tipo del contexto
type TokenContextType = {
  token: string | null;
  saveToken: (token: string) => void;
  removeToken: () => void;
};

// Crea el contexto
const TokenContext = createContext<TokenContextType | undefined>(undefined);

// Provider que envuelve tu app
export function TokenProvider({ children }: { children: ReactNode }) {
  // Inicializa token desde localStorage si existe
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));

  // Guarda el token en contexto y localStorage
  const saveToken = (t: string) => {
    localStorage.setItem("token", t);
    setToken(t);
  };

  // Borra el token del contexto y localStorage
  const removeToken = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <TokenContext.Provider value={{ token, saveToken, removeToken }}>
      {children}
    </TokenContext.Provider>
  );
}

// Hook personalizado para acceder al token
export const useToken = () => {
  const ctx = useContext(TokenContext);
  if (!ctx) throw new Error("useToken must be used within TokenProvider");
  return ctx;
};