import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { saveToken, saveUser } from "../utils/auth";
import { Helmet } from "react-helmet-async";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("El correo es obligatorio.");
      return;
    }
    if (!password.trim()) {
      setError("La contraseña es obligatoria.");
      return;
    }

    setLoading(true);
    try {
      const response = await login(username, password);
      saveToken(response.token);
      saveUser(response.usuario);
      navigate("/dashboard");
    } catch {
      setError("Credenciales incorrectas o error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Helmet>
        <title>Iniciar Sesión | GymFlow</title>
        <meta name="description" content="Inicia sesión en GymFlow para gestionar tus ejercicios y rutinas." />
        <meta name="keywords" content="login, acceso, gimnasio, GymFlow" />
        <meta name="author" content="TuNombre" />
        <meta property="og:title" content="Login - GymFlow" />
        <meta property="og:description" content="Accede a tu cuenta de GymFlow." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="login-card">
        <h1>💪 GymFlow</h1>
        <p>Inicia sesión para continuar</p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Correo</label>
            <input
              id="username"
              type="text"
              placeholder="admin@gym.com"
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

          {error && <div className="alert-error">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
