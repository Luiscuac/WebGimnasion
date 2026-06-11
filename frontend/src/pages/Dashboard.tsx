import { getUser } from "../utils/auth";

export default function Dashboard() {
  const user = getUser();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bienvenido, {user?.nombre}</p>
      <p>Rol: {user?.role}</p>
    </div>
  );
}