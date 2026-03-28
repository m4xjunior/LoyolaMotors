import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contextos/ContextoAutenticacao";
import "./BarraNavAdmin.scss";

const AdminNavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, hasRole } = useAuth();
  const location = useLocation();

  const adminMenuItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: "📊",
      requiredRole: "empleado",
    },
    {
      title: "Clientes",
      path: "/dashboard/clientes",
      icon: "👥",
      requiredRole: "empleado",
    },
    {
      title: "Veículos",
      path: "/dashboard/vehiculos",
      icon: "🚗",
      requiredRole: "empleado",
    },
    {
      title: "Serviços",
      path: "/dashboard/servicios",
      icon: "🔧",
      requiredRole: "empleado",
    },
    {
      title: "Usuários",
      path: "/dashboard/usuarios",
      icon: "👤",
      requiredRole: "admin",
    },
  ];

  const filteredMenuItems = adminMenuItems.filter((item) =>
    hasRole(item.requiredRole),
  );

  const isActiveLink = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  if (!user) return null;

  return (
    <div className="admin-navbar">
      {/* Mobile Toggle Button */}
      <button
        className={`admin-nav-toggle ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Admin Menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Admin Navigation Menu */}
      <nav className={`admin-nav-menu ${isOpen ? "open" : ""}`}>
        <div className="admin-nav-header">
          <div className="admin-user-info">
            <div className="admin-avatar">{user.nombre?.charAt(0) || "A"}</div>
            <div className="admin-user-details">
              <span className="admin-user-name">{user.nombre || "Admin"}</span>
              <span className="admin-user-role">
                {user.rol === "admin" ? "Administrador" : "Funcionário"}
              </span>
            </div>
          </div>
        </div>

        <div className="admin-nav-items">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${isActiveLink(item.path) ? "active" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              <span className="admin-nav-text">{item.title}</span>
            </Link>
          ))}
        </div>

        <div className="admin-nav-footer">
          <Link
            to="/"
            className="admin-nav-item back-to-site"
            onClick={() => setIsOpen(false)}
          >
            <span className="admin-nav-icon">🏠</span>
            <span className="admin-nav-text">Voltar ao Site</span>
          </Link>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="admin-nav-overlay" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default AdminNavBar;
