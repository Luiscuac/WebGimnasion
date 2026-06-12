import { getUser } from "../utils/auth";
import { Helmet } from "react-helmet-async";
import { getEjercicios } from "../services/ejercicioService";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const user = getUser();
  const isAdmin = user?.role === "Administrador";

  const [totalEjercicios, setTotalEjercicios] = useState("—");
  const [totalMusculares, setTotalMusculares] = useState("—");
  const [ultimoEjercicio, setUltimoEjercicio] = useState("—");

  useEffect(() => {
    getEjercicios()
      .then((data) => {
        setTotalEjercicios(String(data.length));
        const grupos = new Set(data.map((e) => e.grupoMuscular));
        setTotalMusculares(String(grupos.size));
        if (data.length > 0) setUltimoEjercicio(data[data.length - 1].nombre);
      })
      .catch(() => {});
  }, []);

  const quickLinks = [
    {
      icon: "🏋️",
      title: "Gestión de Ejercicios",
      desc: isAdmin
        ? "Crea, edita y elimina ejercicios del sistema."
        : "Visualiza los ejercicios registrados.",
      to: "/ejercicios",
      label: isAdmin ? "Gestionar" : "Ver ejercicios",
    },
    {
      icon: "🌐",
      title: "Explorar API Pública",
      desc: "Descubre cientos de ejercicios con animaciones desde ExerciseDB.",
      to: "/explorar",
      label: "Explorar",
    },
    {
      icon: "👤",
      title: "Mi Perfil",
      desc: "Consulta tu información de cuenta y permisos.",
      to: "/perfil",
      label: "Ver perfil",
    },
  ];

  return (
    <div>
      <Helmet>
        <title>Dashboard | GymFlow</title>
        <meta name="description" content="Panel de control de GymFlow." />
        <meta property="og:title" content="Dashboard - GymFlow" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Saludo */}
      <div className="page-header">
        <h1>Bienvenido, {user?.nombre} 👋</h1>
        <p>
          Estás conectado como <strong>{user?.role}</strong>. Aquí tienes un
          resumen de tu sistema.
        </p>
      </div>

      {/* Stats */}
      <div className="stats-grid stats-grid-3">
        <div className="stat-card">
          <div>
            <p>Ejercicios registrados</p>
            <h3>{totalEjercicios}</h3>
          </div>
          <div className="stat-card-icon">🏋️</div>
        </div>

        <div className="stat-card">
          <div>
            <p>Grupos musculares</p>
            <h3>{totalMusculares}</h3>
          </div>
          <div className="stat-card-icon">💪</div>
        </div>

        <div className="stat-card">
          <div>
            <p>Tu rol</p>
            <h3 className="stat-card-role">{user?.role}</h3>
          </div>
          <div className="stat-card-icon">{isAdmin ? "🛡️" : "👤"}</div>
        </div>
      </div>

      {/* Último ejercicio */}
      {ultimoEjercicio !== "—" && (
        <div className="card card-highlight">
          <div className="card-highlight-inner">
            <span className="card-highlight-icon">⚡</span>
            <div>
              <p className="card-highlight-label">Último ejercicio registrado</p>
              <p className="card-highlight-value">{ultimoEjercicio}</p>
            </div>
          </div>
        </div>
      )}

      {/* Accesos rápidos */}
      <h2 className="section-title">Acceso rápido</h2>
      <div className="quick-links-grid">
        {quickLinks.map((ql) => (
          <div className="quick-link-card" key={ql.to}>
            <div className="quick-link-icon">{ql.icon}</div>
            <div className="quick-link-body">
              <h3>{ql.title}</h3>
              <p>{ql.desc}</p>
            </div>
            <Link to={ql.to} className="btn btn-primary quick-link-btn">
              {ql.label}
            </Link>
          </div>
        ))}
      </div>

      {/* Permisos */}
      <div className="card">
        <h2 className="card-title">Tus permisos</h2>
        <div className="permissions-grid">
          {[
            { label: "Ver ejercicios", allowed: true },
            { label: "Crear ejercicios", allowed: isAdmin },
            { label: "Editar ejercicios", allowed: isAdmin },
            { label: "Eliminar ejercicios", allowed: isAdmin },
          ].map((p) => (
            <div className={`permission-item ${p.allowed ? "allowed" : "denied"}`} key={p.label}>
              <span>{p.allowed ? "✅" : "🚫"}</span>
              <span>{p.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
