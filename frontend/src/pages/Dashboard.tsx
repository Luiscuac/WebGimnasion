import { getUser } from "../utils/auth";

export default function Dashboard() {
  const user = getUser();

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Bienvenido de vuelta, {user?.nombre}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <p>Ejercicios</p>
            <h3>—</h3>
          </div>
          <div className="stat-card-icon">🏋️</div>
        </div>
        <div className="stat-card">
          <div>
            <p>Grupos Musculares</p>
            <h3>—</h3>
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