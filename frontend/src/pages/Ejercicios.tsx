import { useState, useEffect } from "react";
import { getUser } from "../utils/auth";
import type { Ejercicio } from "../types/auth";
import {
  getEjercicios,
  createEjercicio,
  updateEjercicio,
  deleteEjercicio,
} from "../services/ejercicioService";
import { Helmet } from "react-helmet-async";

export default function Ejercicios() {
  const user = getUser();
  const isAdmin = user?.role === "Administrador";

  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [form, setForm] = useState<Ejercicio>({
    nombre: "",
    grupoMuscular: "",
    maquina: "",
    series: 0,
    repeticiones: 0,
  });
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEjercicios();
  }, []);

  async function cargarEjercicios() {
    setLoading(true);
    try {
      const data = await getEjercicios();
      setEjercicios(data);
    } catch {
      setError("Error al cargar ejercicios.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMensaje("");
    setError("");

    if (!form.nombre.trim()) { setError("El nombre es obligatorio."); return; }
    if (form.nombre.trim().length < 3) { setError("El nombre debe tener al menos 3 caracteres."); return; }
    if (!form.grupoMuscular.trim()) { setError("El grupo muscular es obligatorio."); return; }
    if (!form.maquina.trim()) { setError("La máquina es obligatoria."); return; }
    if (form.series <= 0) { setError("Las series deben ser mayor a 0."); return; }
    if (form.repeticiones <= 0) { setError("Las repeticiones deben ser mayor a 0."); return; }

    try {
      if (editandoId !== null) {
        await updateEjercicio(editandoId, form);
        setMensaje("Ejercicio actualizado con éxito.");
      } else {
        await createEjercicio(form);
        setMensaje("Ejercicio creado con éxito.");
      }
      setForm({ nombre: "", grupoMuscular: "", maquina: "", series: 0, repeticiones: 0 });
      setEditandoId(null);
      cargarEjercicios();
    } catch {
      setError("Error al guardar el ejercicio.");
    }
  }

  function handleEditar(ejercicio: Ejercicio) {
    setForm({
      nombre: ejercicio.nombre,
      grupoMuscular: ejercicio.grupoMuscular,
      maquina: ejercicio.maquina,
      series: ejercicio.series,
      repeticiones: ejercicio.repeticiones,
    });
    setEditandoId(ejercicio.id!);
    setMensaje("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleEliminar(id: number) {
    if (!confirm("¿Estás seguro de eliminar este ejercicio?")) return;
    try {
      await deleteEjercicio(id);
      setMensaje("Ejercicio eliminado con éxito.");
      cargarEjercicios();
    } catch {
      setError("Error al eliminar el ejercicio.");
    }
  }

  function handleCancelar() {
    setForm({ nombre: "", grupoMuscular: "", maquina: "", series: 0, repeticiones: 0 });
    setEditandoId(null);
    setMensaje("");
    setError("");
  }

  return (
    <div>
      <Helmet>
        <title>Gestión de Ejercicios | GymFlow</title>
        <meta name="description" content="Gestiona tus ejercicios y rutinas en GymFlow." />
        <meta name="keywords" content="ejercicios, rutinas, gimnasio, GymFlow" />
        <meta name="author" content="TuNombre" />
        <meta property="og:title" content="Gestión de Ejercicios - GymFlow" />
        <meta property="og:description" content="Gestiona tus ejercicios y rutinas en GymFlow." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="page-header">
        <h1>Gestión de Ejercicios</h1>
        <p>
          {isAdmin
            ? "Crea, edita y elimina ejercicios del sistema."
            : "Visualiza los ejercicios registrados."}
        </p>
      </div>

      {/* FORMULARIO SOLO ADMINISTRADOR */}
      {isAdmin && (
        <div className="card card-form">
          <h2 className="card-subtitle">
            {editandoId !== null ? "✏️ Editar Ejercicio" : "➕ Nuevo Ejercicio"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="nombre">Nombre</label>
                <input
                  id="nombre"
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Press de banca"
                />
              </div>

              <div className="form-group">
                <label htmlFor="grupoMuscular">Grupo Muscular</label>
                <input
                  id="grupoMuscular"
                  type="text"
                  name="grupoMuscular"
                  value={form.grupoMuscular}
                  onChange={handleChange}
                  placeholder="Ej: Pecho"
                />
              </div>

              <div className="form-group">
                <label htmlFor="maquina">Máquina</label>
                <input
                  id="maquina"
                  type="text"
                  name="maquina"
                  value={form.maquina}
                  onChange={handleChange}
                  placeholder="Ej: Barra libre"
                />
              </div>

              <div className="form-group">
                <label htmlFor="series">Series</label>
                <input
                  id="series"
                  type="number"
                  name="series"
                  value={form.series}
                  onChange={handleChange}
                  placeholder="Ej: 4"
                />
              </div>

              <div className="form-group">
                <label htmlFor="repeticiones">Repeticiones</label>
                <input
                  id="repeticiones"
                  type="number"
                  name="repeticiones"
                  value={form.repeticiones}
                  onChange={handleChange}
                  placeholder="Ej: 10"
                />
              </div>
            </div>

            {mensaje && <div className="alert-success">{mensaje}</div>}
            {error && <div className="alert-error">{error}</div>}

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editandoId !== null ? "Actualizar" : "Guardar"}
              </button>
              {editandoId !== null && (
                <button type="button" className="btn btn-secondary" onClick={handleCancelar}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* MENSAJES PARA USUARIO NO ADMIN */}
      {!isAdmin && mensaje && <div className="alert-success">{mensaje}</div>}
      {!isAdmin && error && <div className="alert-error">{error}</div>}

      {/* TABLA */}
      <div className="card">
        <h2 className="card-subtitle">📋 Lista de Ejercicios</h2>

        {loading ? (
          <p className="text-muted">Cargando...</p>
        ) : ejercicios.length === 0 ? (
          <p className="text-muted">No hay ejercicios registrados.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Grupo Muscular</th>
                  <th>Máquina</th>
                  <th>Series</th>
                  <th>Repeticiones</th>
                  {isAdmin && <th>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {ejercicios.map((ej) => (
                  <tr key={ej.id}>
                    <td className="td-bold">{ej.nombre}</td>
                    <td>{ej.grupoMuscular}</td>
                    <td>{ej.maquina}</td>
                    <td>{ej.series}</td>
                    <td>{ej.repeticiones}</td>
                    {isAdmin && (
                      <td>
                        <div className="table-actions">
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleEditar(ej)}
                          >
                            ✏️ Editar
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleEliminar(ej.id!)}
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
