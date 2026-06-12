import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/authService";
import { saveToken, saveUser } from "../utils/auth";
import { Helmet } from "react-helmet-async";

export default function Register() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nombre.trim()) { setError("El nombre es obligatorio."); return; }
    if (nombre.trim().length < 3) { setError("El nombre debe tener al menos 3 caracteres."); return; }

    if (!username.trim()) { setError("El correo es obligatorio."); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username.trim())) { setError("Ingresa un correo válido."); return; }

    if (!password) { setError("La contraseña es obligatoria."); return; }
    if (password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres."); return; }

    if (password !== confirmar) { setError("Las contraseñas no coinciden."); return; }

    setLoading(true);
    try {
      const response = await register({ username, password, nombre });
      saveToken(response.token);
      saveUser(response.usuario);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message ?? "Error al registrarse.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Helmet>
        <title>Crear Cuenta | GymFlow</title>
        <meta name="description" content="Crea tu cuenta en GymFlow para gestionar tus ejercicios y rutinas." />
        <meta name="keywords" content="registro, crear cuenta, gimnasio, GymFlow" />
        <meta name="author" content="TuNombre" />
        <meta property="og:title" content="Crear Cuenta - GymFlow" />
        <meta property="og:description" content="Crea tu cuenta en GymFlow." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="login-card">
        <h1>💪 GymFlow</h1>
        <p>Crea tu cuenta para comenzar</p>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre completo</label>
            <input
              id="nombre"
              type="text"
              placeholder="Ej: Juan Pérez"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Correo</label>
            <input
              id="username"
              type="email"
              placeholder="tucorreo@ejemplo.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmar">Confirmar contraseña</label>
            <input
              id="confirmar"
              type="password"
              placeholder="••••••••"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
            />
          </div>

          {error && <div className="alert-error">{error}</div>}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Creando cuenta..." : "Registrarse"}
          </button>
        </form>

        <p className="register-link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}