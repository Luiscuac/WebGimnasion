import { useState, useEffect } from "react";
import { getUser } from "../utils/auth";
import type { UsuarioGestion } from "../types/auth";
import { getUsuarios, cambiarRol, eliminarUsuario } from "../services/usuarioService";
import { Helmet } from "react-helmet-async";

export default function GestionUsuarios() {
  const usuarioActual = getUser();
  if (usuarioActual?.role !== "Administrador") {
   return (
    <div>
      <Helmet>
        <title>Acceso Denegado | GymFlow</title>
      </Helmet>
      <div className="page-header">
        <h1>Acceso Denegado</h1>
        <p>Esta sección es solo para administradores.</p>
      </div>
      <div className="alert-error">No tienes permisos para ver esta página.</div>
    </div>
   );
  }
  const [usuarios, setUsuarios] = useState<UsuarioGestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    cargarUsuarios();
  }, []);

  async function cargarUsuarios() {
    setLoading(true);
    try {
      const data = await getUsuarios();
      setUsuarios(data);
    } catch {
      setError("Error al cargar usuarios.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCambiarRol(id: number, nuevoRol: string) {
    setMensaje("");
    setError("");
    try {
      await cambiarRol(id, nuevoRol);
      setMensaje("Rol actualizado con éxito.");
      cargarUsuarios();
    } catch (err: any) {
      setError(err.response?.data?.mensaje ?? "Error al actualizar el rol.");
    }
  }

  async function handleEliminar(id: number, nombre: string) {
    if (!confirm(`¿Estás seguro de eliminar al usuario "${nombre}"?`)) return;
    setMensaje("");
    setError("");
    try {
      await eliminarUsuario(id);
      setMensaje("Usuario eliminado con éxito.");
      cargarUsuarios();
    } catch (err: any) {
      setError(err.response?.data?.mensaje ?? "Error al eliminar usuario.");
    }
  }

  return (
    <div>
      <Helmet>
        <title>Gestión de Usuarios | GymFlow</title>
        <meta name="description" content="Administra los usuarios y roles del sistema GymFlow." />
        <meta name="keywords" content="usuarios, roles, administración, GymFlow" />
        <meta name="author" content="TuNombre" />
        <meta property="og:title" content="Gestión de Usuarios - GymFlow" />
        <meta property="og:description" content="Administra los usuarios y roles del sistema." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="page-header">
        <h1>Gestión de Usuarios</h1>
        <p>Asigna roles de Administrador o elimina cuentas del sistema.</p>
      </div>

      {mensaje && <div className="alert-success">{mensaje}</div>}
      {error && <div className="alert-error">{error}</div>}

      <div className="card">
        {loading ? (
          <p className="text-muted">Cargando...</p>
        ) : usuarios.length === 0 ? (
          <p className="text-muted">No hay usuarios registrados.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => {
                  const esYoMismo = u.id === usuarioActual?.id;
                  return (
                    <tr key={u.id}>
                      <td className="td-bold">{u.nombre}</td>
                      <td>{u.username}</td>
                      <td>
                        <span className={`profile-badge ${u.role === "Administrador" ? "badge-admin" : "badge-user"}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          {u.role === "Usuario" ? (
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleCambiarRol(u.id, "Administrador")}
                            >
                              ⬆️ Hacer Admin
                            </button>
                          ) : (
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleCambiarRol(u.id, "Usuario")}
                              disabled={esYoMismo}
                              title={esYoMismo ? "No puedes quitarte tu propio rol" : ""}
                            >
                              ⬇️ Quitar Admin
                            </button>
                          )}
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleEliminar(u.id, u.nombre)}
                            disabled={esYoMismo}
                            title={esYoMismo ? "No puedes eliminar tu propia cuenta" : ""}
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}