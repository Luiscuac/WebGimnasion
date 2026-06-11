import { getUser } from "../utils/auth";

export default function Perfil() {
  const user = getUser();

  return (
    <div>
      <div className="page-header">
        <h1>Mi Perfil</h1>
        <p>Información de tu cuenta</p>
      </div>

      <div className="card" style={{ maxWidth: "500px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "50%",
            backgroundColor: "var(--primary)", display: "flex",
            alignItems: "center", justifyContent: "center",
            fontSize: "1.75rem"
          }}>
            👤
          </div>
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "800" }}>{user?.nombre}</h2>
            <span style={{
              backgroundColor: "var(--border)", color: "var(--text-muted)",
              padding: "0.2rem 0.75rem", borderRadius: "999px",
              fontSize: "0.75rem", fontWeight: "700"
            }}>
              {user?.role}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600",
              textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>
              ID de usuario
            </p>
            <p style={{ fontWeight: "600" }}>#{user?.id}</p>
          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600",
              textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>
              Correo
            </p>
            <p style={{ fontWeight: "600" }}>{user?.username}</p>
          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600",
              textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>
              Rol
            </p>
            <p style={{ fontWeight: "600" }}>{user?.role}</p>
          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600",
              textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>
              Permisos
            </p>
            <p style={{ fontWeight: "600", color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: "1.6" }}>
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