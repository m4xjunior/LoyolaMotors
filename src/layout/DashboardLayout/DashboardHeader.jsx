import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useDashboard } from "./DashboardMain";

const DashboardHeader = () => {
  const { user } = useAuth();
  const { toggleSidebar } = useDashboard();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    // Logout logic would be handled by AuthContext
    setShowUserMenu(false);
  };

  return (
    <header style={styles.header}>
      <div style={styles.headerContent}>
        <div style={styles.leftSection}>
          <button
            onClick={toggleSidebar}
            style={styles.menuButton}
            aria-label="Toggle sidebar"
          >
            <span style={styles.menuIcon}>☰</span>
          </button>
          <h1 style={styles.title}>Painel de Controle</h1>
        </div>

        <div style={styles.rightSection}>
          <div style={styles.userInfo}>
            <span style={styles.welcomeText}>
              Bem-vindo, <strong>{user?.nombre || "Usuário"}</strong>
            </span>
            <div style={styles.userMenuContainer}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={styles.userButton}
                aria-label="Menu do usuário"
              >
                <div style={styles.userAvatar}>
                  {user?.nombre?.charAt(0) || "U"}
                </div>
                <span style={styles.userName}>{user?.nombre || "Usuário"}</span>
              </button>

              {showUserMenu && (
                <div style={styles.userMenu}>
                  <div style={styles.userMenuHeader}>
                    <div style={styles.userMenuAvatar}>
                      {user?.nombre?.charAt(0) || "U"}
                    </div>
                    <div style={styles.userMenuInfo}>
                      <div style={styles.userMenuName}>
                        {user?.nombre} {user?.apellidos}
                      </div>
                      <div style={styles.userMenuEmail}>{user?.email}</div>
                      <div style={styles.userMenuRole}>
                        {user?.rol === "admin"
                          ? "Administrador"
                          : "Funcionário"}
                      </div>
                    </div>
                  </div>
                  <div style={styles.userMenuItems}>
                    <button style={styles.userMenuItem}>
                      <span>👤</span>
                      Meu Perfil
                    </button>
                    <button style={styles.userMenuItem}>
                      <span>⚙️</span>
                      Configurações
                    </button>
                    <button style={styles.userMenuItem} onClick={handleLogout}>
                      <span>🚪</span>
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: "var(--body-bg-color, #101010)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "1rem 2rem",
    backdropFilter: "blur(10px)",
  },
  headerContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "100%",
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  menuButton: {
    background: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "8px",
    padding: "8px 12px",
    cursor: "pointer",
    color: "var(--heading-color)",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  menuIcon: {
    fontSize: "18px",
  },
  title: {
    color: "var(--heading-color)",
    fontSize: "1.5rem",
    fontWeight: "600",
    margin: 0,
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
  },
  userInfo: {
    position: "relative",
  },
  welcomeText: {
    color: "var(--body-color)",
    fontSize: "14px",
    marginRight: "1rem",
  },
  userMenuContainer: {
    position: "relative",
    display: "inline-block",
  },
  userButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    padding: "8px 12px",
    cursor: "pointer",
    color: "var(--heading-color)",
    transition: "all 0.3s ease",
  },
  userAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #ff3d24, #e02912)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "600",
    fontSize: "14px",
  },
  userName: {
    fontSize: "14px",
    fontWeight: "500",
  },
  userMenu: {
    position: "absolute",
    top: "100%",
    right: 0,
    marginTop: "8px",
    background: "rgba(26, 26, 26, 0.98)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    padding: "16px",
    minWidth: "280px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
    zIndex: 1000,
  },
  userMenuHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    paddingBottom: "16px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    marginBottom: "12px",
  },
  userMenuAvatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #ff3d24, #e02912)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "600",
    fontSize: "18px",
  },
  userMenuInfo: {
    flex: 1,
  },
  userMenuName: {
    color: "var(--heading-color)",
    fontWeight: "600",
    fontSize: "16px",
    marginBottom: "4px",
  },
  userMenuEmail: {
    color: "var(--body-color)",
    fontSize: "14px",
    marginBottom: "4px",
  },
  userMenuRole: {
    color: "#ff3d24",
    fontSize: "12px",
    fontWeight: "500",
    textTransform: "uppercase",
  },
  userMenuItems: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  userMenuItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    background: "transparent",
    border: "none",
    borderRadius: "8px",
    color: "var(--body-color)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontSize: "14px",
    textAlign: "left",
  },
};

export default DashboardHeader;
