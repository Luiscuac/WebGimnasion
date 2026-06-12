import axios from "axios";
import type { UsuarioGestion } from "../types/auth";
import { getToken } from "../utils/auth";

const API_URL = "https://gymflow-backend-00hx.onrender.com/api";

function getHeaders() {
  return {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };
}

// LISTAR USUARIOS
export async function getUsuarios(): Promise<UsuarioGestion[]> {
  const response = await axios.get<UsuarioGestion[]>(
    `${API_URL}/usuarios`,
    getHeaders()
  );
  return response.data;
}

// CAMBIAR ROL
export async function cambiarRol(id: number, role: string): Promise<void> {
  await axios.put(`${API_URL}/usuarios/${id}/rol`, { role }, getHeaders());
}

// ELIMINAR USUARIO
export async function eliminarUsuario(id: number): Promise<void> {
  await axios.delete(`${API_URL}/usuarios/${id}`, getHeaders());
}