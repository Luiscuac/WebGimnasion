import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout, getUser } from "../utils/auth";
import { useState, useEffect } from "react";

export default function PrivateNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) =>
    location.pathname === path ? "sidebar-link active" : "sidebar-link";

  return (
    <>
      {/* TOPBAR SOLO VISIBLE EN MOBILE */}
      <header className="mobile-topbar">
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <span className="topbar-logo">💪 GymFlow</span>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </header>

      {/* OVERLAY MOBILE */}
      <div
        className={`sidebar-overlay ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* SIDEBAR */}
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">💪</div>
          <h1>GymFlow</h1>
        </div>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className={isActive("/dashboard")}>
            📊 Dashboard
          </Link>
          <Link to="/ejercicios" className={isActive("/ejercicios")}>
            🏋️ Ejercicios
          </Link>
          <Link to="/explorar" className={isActive("/explorar")}>
            🔍 Explorar API
          </Link>
          <Link to="/perfil" className={isActive("/perfil")}>
            👤 Perfil
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <p>{user?.nombre}</p>
            <span>{user?.role}</span>
          </div>
          <button
            className="theme-toggle theme-toggle-sidebar"
            onClick={toggleTheme}
          >
            {theme === "dark" ? "☀️ Modo claro" : "🌙 Modo oscuro"}
          </button>
          <button className="sidebar-link" onClick={handleLogout}>
            🚪 Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}
