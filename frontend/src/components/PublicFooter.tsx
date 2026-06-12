export default function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="footer-grid">
        {/* COLUMNA 1 - LOGO Y DESCRIPCIÓN */}
        <div className="footer-brand">
          <h2>💪 GymFlow</h2>
          <p>
            Tu sistema de gestión de gimnasio moderno. Administra ejercicios,
            explora rutinas y lleva el control de tu entrenamiento en un solo lugar.
          </p>
        </div>

        {/* COLUMNA 2 - ENLACES */}
        <div className="footer-links">
          <h3>Enlaces Rápidos</h3>
          <ul>
            <li><a href="/">Inicio</a></li>
            <li><a href="/login">Iniciar Sesión</a></li>
            <li><a href="/register">Registrarse</a></li>
          </ul>
        </div>

        {/* COLUMNA 3 - CONTACTO */}
        <div className="footer-links">
          <h3>Información</h3>
          <ul>
            <li>soporte@gymflow.com</li>
            <li>Cochabamba, Bolivia</li>
            <li>Tecnologías Web II</li>
          </ul>
        </div>
      </div>

      {/* LÍNEA INFERIOR */}
      <div className="footer-bottom">
        <p>© 2025 GymFlow. Todos los derechos reservados.</p>
        <p>Desarrollado por Luis Andre Angulo Gutierrez</p>
      </div>
    </footer>
  );
}