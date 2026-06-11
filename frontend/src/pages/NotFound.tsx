import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Esta página no existe.</p>
      <Link to="/">
        <button className="btn btn-primary">Volver al inicio</button>
      </Link>
    </div>
  );
}