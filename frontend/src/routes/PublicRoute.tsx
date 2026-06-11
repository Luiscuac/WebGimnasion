import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

interface Props {
  children: React.ReactNode;
}

// SI NO ESTÁ AUTENTICADO: MUESTRA EL COMPONENTE
// SI YA ESTÁ AUTENTICADO: REDIRIGE AL DASHBOARD
export default function PublicRoute({ children }: Props) {
  return !isAuthenticated() ? <>{children}</> : <Navigate to="/dashboard" />;
}