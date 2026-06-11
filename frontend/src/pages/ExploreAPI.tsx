import { useState, useEffect } from "react";
import { getEjerciciosAPI } from "../services/apiService";
import type { ExercicioAPI } from "../services/apiService";
import { Helmet } from "react-helmet-async";
const MUSCULOS = ["back", "chest", "legs", "shoulders", "arms", "core"];

export default function ExploreAPI() {
  const [todos, setTodos] = useState<ExercicioAPI[]>([]);
  const [ejercicios, setEjercicios] = useState<ExercicioAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtro, setFiltro] = useState("todos");

  useEffect(() => {
    cargarEjercicios();
  }, []);

  async function cargarEjercicios() {
    setLoading(true);
    setError("");
    try {
      const data = await getEjerciciosAPI(60);
      setTodos(data);
      setEjercicios(data);
    } catch {
      setError("No se pudo conectar con la API pública.");
    } finally {
      setLoading(false);
    }
  }

  function handleFiltro(musculo: string) {
    setFiltro(musculo);
    if (musculo === "todos") {
      setEjercicios(todos);
    } else {
      const filtrados = todos.filter((ej) =>
        ej.bodyPart.toLowerCase().includes(musculo.toLowerCase())
      );
      setEjercicios(filtrados);
    }
  }

  return (
    <div>
    <Helmet>
      <title>Explorar Ejercicios | GymFlow</title>
      <meta name="description" content="Explora nuestra colección de ejercicios desde la API pública ExerciseDB." />
      <meta name="keywords" content="ejercicios, API, ExerciseDB, gimnasio, GymFlow" />
      <meta name="author" content="TuNombre" />
      <meta property="og:title" content="Explorar Ejercicios - GymFlow" />
      <meta property="og:description" content="Explora nuestra colección de ejercicios desde la API pública ExerciseDB." />
      <meta property="og:type" content="website" />
    </Helmet>
      <div className="page-header">
        <h1>Explorar Ejercicios</h1>
        <p>Catálogo de ejercicios desde la API pública ExerciseDB</p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <button
          className={`btn ${filtro === "todos" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => handleFiltro("todos")}
        >
          Todos
        </button>
        {MUSCULOS.map((m) => (
          <button
            key={m}
            className={`btn ${filtro === m ? "btn-primary" : "btn-secondary"}`}
            onClick={() => handleFiltro(m)}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
          Cargando ejercicios...
        </div>
      )}

      {error && <div className="alert-error">{error}</div>}

      {!loading && !error && (
        <div className="exercise-grid">
          {ejercicios.map((ej) => (
            <div key={ej.id} className="exercise-card">
              <img src={ej.gifUrl} alt={ej.name} loading="lazy" />
              <div className="exercise-card-body">
                <h4>{ej.name}</h4>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <span className="exercise-tag">{ej.bodyPart}</span>
                  <span className="exercise-tag">{ej.equipment}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && ejercicios.length === 0 && (
        <p style={{ color: "var(--text-muted)" }}>
          No se encontraron ejercicios para este grupo muscular.
        </p>
      )}
    </div>
  );
}