const API_URL = "https://oss.exercisedb.dev/api/v1";

export interface ExercicioAPI {
  id: string;
  name: string;
  bodyPart: string;
  equipment: string;
  gifUrl: string;
  target: string;
}

// OBTENER TODOS LOS EJERCICIOS
export async function getEjerciciosAPI(limit: number = 20): Promise<ExercicioAPI[]> {
  const response = await fetch(`${API_URL}/exercises?limit=${limit}&offset=0`);
  if (!response.ok) throw new Error("Error al obtener ejercicios.");
  const data = await response.json();
  return data.data ?? data;
}

// OBTENER EJERCICIOS POR GRUPO MUSCULAR
export async function getEjerciciosPorMusculo(
  musculo: string
): Promise<ExercicioAPI[]> {
  const response = await fetch(
    `${API_URL}/exercises/bodyPart/${musculo}?limit=20&offset=0`
  );
  if (!response.ok) throw new Error("Error al filtrar.");
  const data = await response.json();
  return data.data ?? data;
}

// OBTENER LISTA DE GRUPOS MUSCULARES DISPONIBLES
export async function getBodyParts(): Promise<string[]> {
  const response = await fetch(`${API_URL}/exercises/bodyPartList`);
  if (!response.ok) throw new Error("Error al obtener grupos.");
  const data = await response.json();
  return data.data ?? data;
}