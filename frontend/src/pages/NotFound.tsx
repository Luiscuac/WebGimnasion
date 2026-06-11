import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="not-found">
      <Helmet>
        <title>404 - Página no encontrada | GymFlow</title>
        <meta name="description" content="La página que buscas no existe en GymFlow." />
        <meta name="keywords" content="404, not found, gimnasio, GymFlow" />
        <meta name="author" content="TuNombre" />
        <meta property="og:title" content="404 - Página no encontrada | GymFlow" />
        <meta property="og:description" content="La página que buscas no existe en GymFlow." />
        <meta property="og:type" content="website" />
      </Helmet>
      <h1>404</h1>
      <p>Esta página no existe.</p>
      <Link to="/">
        <button className="btn btn-primary">Volver al inicio</button>
      </Link>
    </div>
  );
}