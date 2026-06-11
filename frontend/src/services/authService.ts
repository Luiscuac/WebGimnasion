import axios from "axios";
import type { LoginResponse } from "../types/auth";

// URL BASE DE TU BACKEND
const API_URL = "http://localhost:5000/api";

// FUNCIÓN DE LOGIN
export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  try {
    const response = await axios.post<LoginResponse>(
      `${API_URL}/login`,
      { username, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Credenciales incorrectas o error de conexión.");
  }
}