import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import heroImg from "../assets/hero.png";

export default function Home() {
  return (
    <div className="hero">
      <Helmet>
        <title>GymFlow | Inicio</title>
        <meta name="description" content="GymFlow: gestiona ejercicios, explora rutinas y lleva el control de tu entrenamiento en un solo lugar." />
        <meta name="keywords" content="gimnasio, ejercicios, rutinas, entrenamiento, fitness" />
        <meta name="author" content="TuNombre" />
        <meta property="og:title" content="GymFlow - Gestión de Gimnasio" />
        <meta property="og:description" content="Gestiona ejercicios y rutinas de entrenamiento." />
        <meta property="og:image" content={heroImg} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div>
        <h1>
          Entrena más inteligente <br />
          <span>con GymFlow</span>
        </h1>
        <p>
          Gestiona ejercicios, explora rutinas y lleva el control
          de tu entrenamiento en un solo lugar.
        </p>
        <Link to="/login">
          <button className="btn btn-primary btn-hero">
            Comenzar ahora
          </button>
        </Link>
        
      </div>
    </div>
  );
}
