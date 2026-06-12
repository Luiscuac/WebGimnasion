// ESTRUCTURA DEL USUARIO AUTENTICADO
export interface User {
  id: number;
  username: string;
  nombre: string;
  role: string;
}

// RESPUESTA DEL LOGIN
export interface LoginResponse {
  token: string;
  usuario: User;
}

// ESTRUCTURA DE UN EJERCICIO
export interface Ejercicio {
  id?: number;
  nombre: string;
  grupoMuscular: string;
  maquina: string;
  series: number;
  repeticiones: number;
  
}

// DATOS PARA REGISTRO
export interface RegisterData {
  username: string;
  password: string;
  nombre: string;
}

// USUARIO PARA GESTIÓN (admin)
export interface UsuarioGestion {
  id: number;
  username: string;
  nombre: string;
  role: string;
}