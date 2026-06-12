import { getUser } from "../utils/auth";
import { Helmet } from "react-helmet-async";

export default function Perfil() {
  const user = getUser();
  const isAdmin = user?.role === "Administrador";

  const permisos = [
    { label: "Ver ejercicios", ok: true },
    { label: "Crear ejercicios", ok: isAdmin },
    { label: "Editar ejercicios", ok: isAdmin },
    { label: "Eliminar ejercicios", ok: isAdmin },
    { label: "Administrar usuarios", ok: false },
  ];

  return (
    <div>
      <Helmet>
        <title>Mi Perfil | GymFlow</title>
        <meta name="description" content="Visualiza tu perfil en GymFlow." />
        <meta property="og:title" content="Mi Perfil - GymFlow" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="page-header">
        <h1>Mi Perfil</h1>
        <p>Información de tu cuenta y permisos</p>
      </div>

      <div className="perfil-grid">
        {/* Tarjeta principal */}
        <div className="card perfil-main-card">
          <div className="profile-header">
            <div className="profile-avatar">{isAdmin ? "🛡️" : "👤"}</div>
            <div>
              <h2 className="profile-name">{user?.nombre}</h2>
              <span className={`profile-badge ${isAdmin ? "badge-admin" : "badge-user"}`}>
                {user?.role}
              </span>
            </div>
          </div>

          <div className="profile-fields">
            <div className="profile-field">
              <p className="field-label">ID de usuario</p>
              <p className="field-value">#{user?.id}</p>
            </div>
            <div className="profile-field">
              <p className="field-label">Correo electrónico</p>
              <p className="field-value">{user?.username}</p>
            </div>
            <div className="profile-field">
              <p className="field-label">Rol asignado</p>
              <p className="field-value">{user?.role}</p>
            </div>
            <div className="profile-field">
              <p className="field-label">Estado de sesión</p>
              <p className="field-value perfil-status">
                <span className="status-dot" /> Sesión activa
              </p>
            </div>
          </div>
        </div>

        {/* Tarjeta de permisos */}
        <div className="card perfil-permisos-card">
          <h2 className="card-subtitle">🔐 Permisos del rol</h2>
          <div className="perfil-permisos-list">
            {permisos.map((p) => (
              <div
                key={p.label}
                className={`perfil-permiso-item ${p.ok ? "ok" : "no"}`}
              >
                <span className="perfil-permiso-icon">{p.ok ? "✅" : "🚫"}</span>
                <span>{p.label}</span>
              </div>
            ))}
          </div>

          <div className="perfil-info-box">
            <p>
              {isAdmin
                ? "Como Administrador tienes acceso completo al sistema."
                : "Como Usuario tienes acceso de solo lectura. Contacta al administrador para más permisos."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
