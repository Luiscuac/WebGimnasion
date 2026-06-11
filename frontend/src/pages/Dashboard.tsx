import { getUser } from "../utils/auth";
import { Helmet } from "react-helmet-async";
import { getEjercicios } from "../services/ejercicioService";
import { useEffect, useState } from "react";


export default function Dashboard() {
  const user = getUser();
  const [totalEjercicios, setTotalEjercicios] = useState('—');
  const [totalMusculares, setTotalMusculares] = useState('—');

  useEffect(() => {
    getEjercicios().then(data => {
        setTotalEjercicios(String(data.length));
        const grupos = new Set(data.map(e => e.grupoMuscular));
        setTotalMusculares(String(grupos.size));
    }).catch(() => {});
   }, []);

  return (
    <div>
      <Helmet>
        <title>Dashboard | GymFlow</title>
        <meta name="description" content="Panel de control de GymFlow para gestionar tus ejercicios y rutinas." />
        <meta name="keywords" content="dashboard, control, gimnasio, GymFlow" />
        <meta name="author" content="TuNombre" />
        <meta property="og:title" content="Dashboard - GymFlow" />
        <meta property="og:description" content="Panel de control de GymFlow para gestionar tus ejercicios y rutinas." />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Bienvenido de vuelta, {user?.nombre}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <p>Ejercicios</p>
            <h3>{totalEjercicios}</h3>
          </div>
          <div className="stat-card-icon">🏋️</div>
        </div>
        <div className="stat-card">
          <div>
            <p>Grupos Musculares</p>
            <h3>{totalMusculares}</h3>
          </div>
          <div className="stat-card-icon">💪</div>
        </div>
        <div className="stat-card">
          <div>
            <p>Rol</p>
            <h3 style={{ fontSize: "1rem", marginTop: "0.25rem" }}>{user?.role}</h3>
          </div>
          <div className="stat-card-icon">👤</div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: "0.5rem" }}>¿Qué puedes hacer?</h2>
        <ul style={{ paddingLeft: "1.25rem", color: "var(--text-muted)", lineHeight: "2" }}>
          <li>Ver y gestionar ejercicios en <strong>Ejercicios</strong></li>
          <li>Explorar ejercicios de la API pública en <strong>Explorar API</strong></li>
          <li>Ver tu información en <strong>Perfil</strong></li>
        </ul>
      </div>
    </div>
  );
}