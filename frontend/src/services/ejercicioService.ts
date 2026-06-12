import axios from "axios";
import type { Ejercicio } from "../types/auth";
import { getToken } from "../utils/auth";

const API_URL = "http://localhost:5000/api";

function getHeaders() {
  return {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };
}

// OBTENER EJERCICIOS (con filtros opcionales)
export async function getEjercicios(filtros?: {
  nombre?: string;
  grupoMuscular?: string;
}): Promise<Ejercicio[]> {
  const params: Record<string, string> = {};
  if (filtros?.nombre) params.nombre = filtros.nombre;
  if (filtros?.grupoMuscular) params.grupoMuscular = filtros.grupoMuscular;

  const response = await axios.get<Ejercicio[]>(`${API_URL}/ejercicios`, {
    ...getHeaders(),
    params,
  });
  return response.data;
}

// CREAR EJERCICIO
export async function createEjercicio(ejercicio: Ejercicio): Promise<Ejercicio> {
  const response = await axios.post<Ejercicio>(
    `${API_URL}/ejercicios`,
    ejercicio,
    getHeaders()
  );
  return response.data;
}

// EDITAR EJERCICIO
export async function updateEjercicio(id: number, ejercicio: Ejercicio): Promise<void> {
  await axios.put(`${API_URL}/ejercicios/${id}`, ejercicio, getHeaders());
}

// ELIMINAR EJERCICIO
export async function deleteEjercicio(id: number): Promise<void> {
  await axios.delete(`${API_URL}/ejercicios/${id}`, getHeaders());
}