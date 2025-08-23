import { useState, createContext, useContext, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import { useAuth } from "../../contexts/AuthContext";

// 1. Create the context for the dashboard layout
const DashboardContext = createContext();

// 2. Custom hook for easy access to the context
export const useDashboard = () => useContext(DashboardContext);

// 3. Main Layout Component for the entire dashboard area
const DashboardMain = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true });
    }
  }, [user, loading, navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar on small screens when changing pages for better UX
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  // A simple loading state while auth is being checked
  if (loading || !user) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#101010",
          color: "var(--heading-color)",
          fontFamily: "var(--heading-font-family)",
        }}
      >
        <h1>Carregando Painel...</h1>
      </div>
    );
  }

  // Provide sidebar state to all children of the layout
  return (
    <DashboardContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      <div style={styles.layoutContainer}>
        <DashboardSidebar />
        <main
          style={{
            ...styles.mainContent,
            marginLeft: isSidebarOpen
              ? styles.sidebar.openWidth
              : styles.sidebar.closedWidth,
          }}
        >
          <DashboardHeader />
          <div style={styles.pageContent}>
            {/* Renders the specific dashboard page (e.g., Clientes, Veiculos) */}
            <Outlet />
          </div>
        </main>
      </div>
    </DashboardContext.Provider>
  );
};

// Styles object for better organization
const styles = {
  layoutContainer: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "var(--body-bg-color, #101010)",
  },
  sidebar: {
    openWidth: "260px",
    closedWidth: "80px",
  },
  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  pageContent: {
    padding: "2rem",
    flex: 1,
    overflowY: "auto",
    backgroundColor: "#181818", // A slightly lighter bg for content area
  },
};

export default DashboardMain;
