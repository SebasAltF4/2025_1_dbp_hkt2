// src/components/ProtectedRoute.tsx
import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useToken } from "../contexts/TokenContext";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token } = useToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
