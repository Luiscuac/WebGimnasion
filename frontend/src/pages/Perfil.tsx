import { getUser } from "../utils/auth";
import { Helmet } from "react-helmet-async";

export default function Perfil() {
  const user = getUser();

  return (
    <div>
      <Helmet>
        <title>Mi Perfil | GymFlow</title>
        <meta name="description" content="Visualiza tu perfil en GymFlow." />
        <meta name="keywords" content="perfil, cuenta, gimnasio, GymFlow" />
        <meta name="author" content="TuNombre" />
        <meta property="og:title" content="Mi Perfil - GymFlow" />
        <meta property="og:description" content="Visualiza tu perfil en GymFlow." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="page-header">
        <h1>Mi Perfil</h1>
        <p>Información de tu cuenta</p>
      </div>

      <div className="card card-profile">
        <div className="profile-header">
          <div className="profile-avatar">👤</div>
          <div>
            <h2 className="profile-name">{user?.nombre}</h2>
            <span className="profile-badge">{user?.role}</span>
          </div>
        </div>

        <div className="profile-fields">
          <div className="profile-field">
            <p className="field-label">ID de usuario</p>
            <p className="field-value">#{user?.id}</p>
          </div>

          <div className="profile-field">
            <p className="field-label">Correo</p>
            <p className="field-value">{user?.username}</p>
          </div>

          <div className="profile-field">
            <p className="field-label">Rol</p>
            <p className="field-value">{user?.role}</p>
          </div>

          <div className="profile-field">
            <p className="field-label">Permisos</p>
            <p className="field-value-muted">
              {user?.role === "Administrador"
                ? "✅ Ver, crear, editar y eliminar ejercicios"
                : "👁️ Solo visualización de ejercicios"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
