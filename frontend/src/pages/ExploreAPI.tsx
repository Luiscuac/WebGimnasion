import { useState, useEffect } from "react";
import { getEjerciciosAPI } from "../services/apiService";
import type { ExercicioAPI } from "../services/apiService";
import { Helmet } from "react-helmet-async";

export default function ExploreAPI() {
  const [ejercicios, setEjercicios] = useState<ExercicioAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getEjerciciosAPI(40)
      .then(setEjercicios)
      .catch(() => setError("No se pudo conectar con la API pública."))
      .finally(() => setLoading(false));
  }, []);

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

      {loading && <div className="loading-box">Cargando ejercicios...</div>}
      {error && <div className="alert-error">{error}</div>}

      {!loading && !error && (
        <div className="exercise-grid">
          {ejercicios.map((ej) => (
            <div key={ej.id} className="exercise-card">
              <img src={ej.gifUrl} alt={ej.name} loading="lazy" />
              <div className="exercise-card-body">
                <h4>{ej.name}</h4>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}