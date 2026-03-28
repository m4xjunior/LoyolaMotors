import { useState, createContext, useContext, useEffect, useCallback } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import PanelBarraLateral from "./PanelBarraLateral";
import PanelCabecera from "./PanelCabecera";
import { useAutenticacion } from "../../contextos/ContextoAutenticacion";
import useMonitorInactividad from "../../hooks/useMonitorInactividad";
import AvisoInactividad from "../../componentes/AvisoInactividad/AvisoInactividad";

// 1. Create the context for the dashboard layout
const ContextoPanel = createContext();

export const usarPanel = () => useContext(ContextoPanel);

// 3. Main Layout Component for the entire dashboard area
const PanelPrincipal = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { user, loading, cerrarSesion } = useAutenticacion();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/inicio-sesion", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleInactivityLogout = useCallback(() => {
    cerrarSesion();
    navigate("/inicio-sesion", { replace: true });
  }, [cerrarSesion, navigate]);

  const { isWarning, remainingSeconds, resetTimer } = useMonitorInactividad({
    timeout: 900000,      // 15 minutes
    warningTime: 60000,   // 60 seconds warning
    onTimeout: handleInactivityLogout,
    enabled: !loading && !!user,
  });

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
      <div className="flex items-center justify-center h-screen bg-[var(--fondo)]">
        <h1 className="text-[var(--texto-principal)] font-[family-name:var(--fuente-encabezado)]">
          Cargando Panel...
        </h1>
      </div>
    );
  }

  // Provide sidebar state to all children of the layout
  return (
    <>
      <ContextoPanel.Provider value={{ isSidebarOpen, toggleSidebar }}>
        <div className="flex min-h-screen bg-[var(--fondo)]">
          <PanelBarraLateral />
          <main
            className="flex-1 flex flex-col transition-all duration-300"
            style={{ marginLeft: isSidebarOpen ? "260px" : "80px" }}
          >
            <PanelCabecera />
            <div className="p-8 flex-1 overflow-y-auto bg-[var(--fondo-elevado)]">
              {/* Renders the specific dashboard page (e.g., Clientes, Vehiculos) */}
              <Outlet />
            </div>
          </main>
        </div>
      </ContextoPanel.Provider>
      <AvisoInactividad
        isVisible={isWarning}
        remainingSeconds={remainingSeconds}
        onStayLoggedIn={resetTimer}
      />
    </>
  );
};

export default PanelPrincipal;
