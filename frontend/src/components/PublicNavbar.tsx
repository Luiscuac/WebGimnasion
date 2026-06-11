import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function PublicNavbar() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="topbar">
      <span className="topbar-logo">💪 GymFlow</span>
      
      <nav className="topbar-links">
        <Link to="/">Inicio</Link>
        <Link to="/login">
          <button className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
            Login
          </button>
        </Link>
      </nav>
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === "dark" ? "☀️" : "🌙"}
      </button>
    </header>
  );
}