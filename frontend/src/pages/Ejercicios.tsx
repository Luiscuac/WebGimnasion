import { useState, useEffect } from "react";
import { getUser } from "../utils/auth";
import type { Ejercicio } from "../types/auth";
import {
  getEjercicios,
  createEjercicio,
  updateEjercicio,
  deleteEjercicio,
} from "../services/ejercicioService";

export default function Ejercicios() {
  const user = getUser();
  const isAdmin = user?.role === "Administrador";

  // LISTA DE EJERCICIOS
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  // EJERCICIO DEL FORMULARIO
  const [form, setForm] = useState<Ejercicio>({
    nombre: "",
    grupoMuscular: "",
    maquina: "",
    series: 0,
    repeticiones: 0,
  });
  // ID DEL EJERCICIO EN EDICION
  const [editandoId, setEditandoId] = useState<number | null>(null);
  // MENSAJES
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // CARGA LOS EJERCICIOS AL INICIAR
  useEffect(() => {
    cargarEjercicios();
  }, []);

  async function cargarEjercicios() {
    try {
      const data = await getEjercicios();
      setEjercicios(data);
    } catch {
      setError("Error al cargar ejercicios.");
    }
  }

  // MANEJA CAMBIOS EN EL FORMULARIO
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // ENVIAR FORMULARIO (CREAR O EDITAR)
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMensaje("");
    setError("");

    // VALIDACIONES
    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    if (form.nombre.trim().length < 3) {
      setError("El nombre debe tener al menos 3 caracteres.");
      return;
    }
    if (!form.grupoMuscular.trim()) {
      setError("El grupo muscular es obligatorio.");
      return;
    }
    if (!form.maquina.trim()) {
      setError("La máquina es obligatoria.");
      return;
    }
    if (form.series <= 0) {
      setError("Las series deben ser mayor a 0.");
      return;
    }
    if (form.repeticiones <= 0) {
      setError("Las repeticiones deben ser mayor a 0.");
      return;
    }

    try {
      if (editandoId !== null) {
        await updateEjercicio(editandoId, form);
        setMensaje("Ejercicio actualizado con éxito.");
      } else {
        await createEjercicio(form);
        setMensaje("Ejercicio creado con éxito.");
      }
      // LIMPIA EL FORMULARIO
      setForm({
        nombre: "",
        grupoMuscular: "",
        maquina: "",
        series: 0,
        repeticiones: 0,
      });
      setEditandoId(null);
      cargarEjercicios();
    } catch {
      setError("Error al guardar el ejercicio.");
    }
  }

  // CARGAR DATOS EN EL FORMULARIO PARA EDITAR
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
  }

  // ELIMINAR EJERCICIO
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

  // CANCELAR EDICION
  function handleCancelar() {
    setForm({
      nombre: "",
      grupoMuscular: "",
      maquina: "",
      series: 0,
      repeticiones: 0,
    });
    setEditandoId(null);
    setMensaje("");
    setError("");
  }

  return (
    <div>
      <h1>Gestión de Ejercicios</h1>

      {/* FORMULARIO SOLO PARA ADMINISTRADOR */}
      {isAdmin && (
        <div>
          <h2>{editandoId !== null ? "Editar Ejercicio" : "Nuevo Ejercicio"}</h2>
          <form onSubmit={handleSubmit}>

            <label>Nombre</label>
            <br />
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Press de banca"
            />
            <br /><br />

            <label>Grupo Muscular</label>
            <br />
            <input
              type="text"
              name="grupoMuscular"
              value={form.grupoMuscular}
              onChange={handleChange}
              placeholder="Ej: Pecho"
            />
            <br /><br />

            <label>Máquina</label>
            <br />
            <input
              type="text"
              name="maquina"
              value={form.maquina}
              onChange={handleChange}
              placeholder="Ej: Barra libre"
            />
            <br /><br />

            <label>Series</label>
            <br />
            <input
              type="number"
              name="series"
              value={form.series}
              onChange={handleChange}
              placeholder="Ej: 4"
            />
            <br /><br />

            <label>Repeticiones</label>
            <br />
            <input
              type="number"
              name="repeticiones"
              value={form.repeticiones}
              onChange={handleChange}
              placeholder="Ej: 10"
            />
            <br /><br />

            <button type="submit">
              {editandoId !== null ? "Actualizar" : "Guardar"}
            </button>
            {" "}
            {editandoId !== null && (
              <button type="button" onClick={handleCancelar}>
                Cancelar
              </button>
            )}
          </form>
        </div>
      )}

      {/* MENSAJES */}
      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* TABLA DE EJERCICIOS */}
      <h2>Lista de Ejercicios</h2>
      {ejercicios.length === 0 ? (
        <p>No hay ejercicios registrados.</p>
      ) : (
        <table border={1}>
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
                <td>{ej.nombre}</td>
                <td>{ej.grupoMuscular}</td>
                <td>{ej.maquina}</td>
                <td>{ej.series}</td>
                <td>{ej.repeticiones}</td>
                {isAdmin && (
                  <td>
                    <button onClick={() => handleEditar(ej)}>Editar</button>
                    {" "}
                    <button onClick={() => handleEliminar(ej.id!)}>
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}