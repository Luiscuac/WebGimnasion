import { Link } from "react-router-dom";

export default function PublicNavbar() {
  return (
    <nav>
      <Link to="/">Inicio</Link>
      {" | "}
      <Link to="/login">Login</Link>
      <hr />
    </nav>
  );
}