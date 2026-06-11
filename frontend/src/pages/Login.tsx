import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { saveToken, saveUser } from "../utils/auth";

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
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem" }}
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}