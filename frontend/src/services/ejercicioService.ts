import axios from "axios";
import type { Ejercicio } from "../types/auth";
import { getToken } from "../utils/auth";

const API_URL = "http://localhost:5000/api";

// HEADERS CON EL TOKEN JWT
function getHeaders() {
  return {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };
}

// OBTENER TODOS LOS EJERCICIOS
export async function getEjercicios(): Promise<Ejercicio[]> {
  const response = await axios.get<Ejercicio[]>(
    `${API_URL}/ejercicios`,
    getHeaders()
  );
  return response.data;
}

// CREAR EJERCICIO
export async function createEjercicio(
  ejercicio: Ejercicio
): Promise<Ejercicio> {
  const response = await axios.post<Ejercicio>(
    `${API_URL}/ejercicios`,
    ejercicio,
    getHeaders()
  );
  return response.data;
}

// EDITAR EJERCICIO
export async function updateEjercicio(
  id: number,
  ejercicio: Ejercicio
): Promise<void> {
  await axios.put(
    `${API_URL}/ejercicios/${id}`,
    ejercicio,
    getHeaders()
  );
}

// ELIMINAR EJERCICIO
export async function deleteEjercicio(id: number): Promise<void> {
  await axios.delete(`${API_URL}/ejercicios/${id}`, getHeaders());
}