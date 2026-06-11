import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="hero">
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
          <button className="btn btn-primary" style={{ fontSize: "1rem", padding: "0.75rem 2rem" }}>
            Comenzar ahora
          </button>
        </Link>
      </div>
    </div>
  );
}