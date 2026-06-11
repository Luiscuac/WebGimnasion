import { Link, useNavigate } from "react-router-dom";
import { logout, getUser } from "../utils/auth";

export default function PrivateNavbar() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link>
      {" | "}
      <Link to="/ejercicios">Ejercicios</Link>
      {" | "}
      <button onClick={handleLogout}>Cerrar Sesión</button>
      <hr />
      <p>Usuario: {user?.nombre}</p>
      <p>Rol: {user?.role}</p>
      <hr />
    </nav>
  );
}