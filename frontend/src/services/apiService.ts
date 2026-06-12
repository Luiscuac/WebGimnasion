const API_URL = "https://oss.exercisedb.dev/api/v1";

export interface ExercicioAPI {
  id: string;
  name: string;
  gifUrl: string;
}

interface ExercicioRaw {
  exerciseId?: string;
  id?: string;
  name: string;
  gifUrl: string;
}

function normalizar(e: ExercicioRaw): ExercicioAPI {
  return {
    id: e.exerciseId ?? e.id ?? "",
    name: e.name,
    gifUrl: e.gifUrl,
  };
}

export async function getEjerciciosAPI(limit: number = 20): Promise<ExercicioAPI[]> {
  const response = await fetch(`${API_URL}/exercises?limit=${limit}&offset=0`);
  if (!response.ok) throw new Error("Error al obtener ejercicios.");
  const data = await response.json();
  const raw: ExercicioRaw[] = data.data ?? data;
  return raw.map(normalizar);
}