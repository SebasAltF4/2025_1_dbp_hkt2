// src/components/ProtectedRoute.tsx
import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useToken } from "../contexts/TokenContext";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { token } = useToken();
    return token ? <>{children}</> : <Navigate to="/login" />;
}
