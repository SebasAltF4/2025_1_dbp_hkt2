// src/contexts/TokenContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react";

type TokenContextType = {
  token: string | null;
  saveToken: (token: string) => void;
  removeToken: () => void;
};

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export function TokenProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));

  const saveToken = (t: string) => {
    localStorage.setItem("token", t);
    setToken(t);
  };

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

export const useToken = () => {
  const ctx = useContext(TokenContext);
  if (!ctx) throw new Error("useToken must be used within TokenProvider");
  return ctx;
};
