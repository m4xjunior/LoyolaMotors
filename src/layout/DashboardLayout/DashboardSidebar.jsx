import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useDashboard } from "./DashboardMain";

const DashboardSidebar = () => {
  const { user, hasRole } = useAuth();
  const { isSidebarOpen } = useDashboard();
  const location = useLocation();

  const menuItems = [
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

  const filteredMenuItems = menuItems.filter((item) =>
    hasRole(item.requiredRole),
  );

  const isActiveLink = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const toggleExpand = (title) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <aside style={isSidebarOpen ? styles.sidebar.open : styles.sidebar.closed}>
      <div style={styles.sidebarContent}>
        {/* Logo Section */}
        <div style={styles.logoSection}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>🏎️</span>
            {isSidebarOpen && (
              <span style={styles.logoText}>Loyola Motors</span>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav style={styles.navigation}>
          <ul style={styles.menuList}>
            {filteredMenuItems.map((item) => (
              <li key={item.path} style={styles.menuItem}>
                <Link
                  to={item.path}
                  style={{
                    ...styles.menuLink,
                    ...(isActiveLink(item.path) && styles.menuLinkActive),
                  }}
                  title={item.title}
                >
                  <span style={styles.menuIcon}>{item.icon}</span>
                  {isSidebarOpen && (
                    <span style={styles.menuText}>{item.title}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info Section */}
        <div style={styles.userSection}>
          <div style={styles.userInfo}>
            <div style={styles.userAvatar}>
              {user?.nombre?.charAt(0) || "U"}
            </div>
            {isSidebarOpen && (
              <div style={styles.userDetails}>
                <div style={styles.userName}>
                  {user?.nombre} {user?.apellidos}
                </div>
                <div style={styles.userRole}>
                  {user?.rol === "admin" ? "Administrador" : "Funcionário"}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    open: {
      width: "260px",
      minWidth: "260px",
      backgroundColor: "var(--body-bg-color, #101010)",
      borderRight: "1px solid rgba(255, 255, 255, 0.1)",
      height: "100vh",
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 100,
      transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      overflowY: "auto",
      overflowX: "hidden",
    },
    closed: {
      width: "80px",
      minWidth: "80px",
      backgroundColor: "var(--body-bg-color, #101010)",
      borderRight: "1px solid rgba(255, 255, 255, 0.1)",
      height: "100vh",
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 100,
      transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      overflowY: "auto",
      overflowX: "hidden",
    },
  },
  sidebarContent: {
    padding: "1.5rem 0",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  logoSection: {
    padding: "0 1.5rem 2rem",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    marginBottom: "2rem",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "var(--heading-color)",
    textDecoration: "none",
  },
  logoIcon: {
    fontSize: "24px",
    width: "40px",
    height: "40px",
    background: "linear-gradient(135deg, #ff3d24, #e02912)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: "18px",
    fontWeight: "700",
    background:
      "linear-gradient(135deg, var(--heading-color), var(--primary-color))",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  navigation: {
    flex: 1,
  },
  menuList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  menuItem: {
    marginBottom: "4px",
  },
  menuLink: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 1.5rem",
    color: "var(--body-color)",
    textDecoration: "none",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      color: "var(--heading-color)",
    },
  },
  menuLinkActive: {
    backgroundColor: "rgba(255, 61, 36, 0.1)",
    color: "#ff3d24",
    "&::before": {
      content: '""',
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: "4px",
      background: "#ff3d24",
      borderRadius: "0 2px 2px 0",
    },
  },
  menuIcon: {
    fontSize: "18px",
    width: "24px",
    textAlign: "center",
    flexShrink: 0,
  },
  menuText: {
    fontSize: "14px",
    fontWeight: "500",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  userSection: {
    padding: "1.5rem",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    marginTop: "auto",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  userAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #ff3d24, #e02912)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "600",
    fontSize: "16px",
    flexShrink: 0,
  },
  userDetails: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    color: "var(--heading-color)",
    fontSize: "14px",
    fontWeight: "600",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  userRole: {
    color: "var(--body-color)",
    fontSize: "12px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
};

export default DashboardSidebar;
