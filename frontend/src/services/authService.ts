import axios from "axios";
import type { LoginResponse, RegisterData } from "../types/auth";

const API_URL = "https://gymflow-backend-00hx.onrender.com/api";

// FUNCIÓN DE LOGIN
export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  try {
    const response = await axios.post<LoginResponse>(
      `${API_URL}/login`,
      { username, password },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    throw new Error("Credenciales incorrectas o error de conexión.");
  }
}

// FUNCIÓN DE REGISTRO
export async function register(data: RegisterData): Promise<LoginResponse> {
  try {
    const response = await axios.post<LoginResponse>(
      `${API_URL}/register`,
      data,
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error: any) {
    const mensaje = error.response?.data?.mensaje ?? "Error al registrarse.";
    throw new Error(mensaje);
  }
}