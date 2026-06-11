import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

interface Props {
  children: React.ReactNode;
}

// SI ESTÁ AUTENTICADO: MUESTRA EL COMPONENTE
// SI NO: REDIRIGE AL LOGIN
export default function PrivateRoute({ children }: Props) {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
}