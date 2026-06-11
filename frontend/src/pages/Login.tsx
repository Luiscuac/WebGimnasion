import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { saveToken, saveUser } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await login(username, password);
      saveToken(response.token);
      saveUser(response.usuario);
      navigate("/dashboard");
    } catch {
      setError("Credenciales incorrectas o error de conexión.");
    }
  };

  return (
    <div>
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleLogin}>
        <label>Usuario</label>
        <br />
        <input
          type="text"
          placeholder="Correo"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br /><br />
        <label>Contraseña</label>
        <br />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />
        <button type="submit">Ingresar</button>
      </form>
      <br />
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}