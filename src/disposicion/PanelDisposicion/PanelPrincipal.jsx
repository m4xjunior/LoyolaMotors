import { useState, createContext, useContext, useEffect, useCallback } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import PanelBarraLateral from "./PanelBarraLateral";
import PanelCabecera from "./PanelCabecera";
import { useAutenticacion } from "../../contextos/ContextoAutenticacion";
import useMonitorInactividad from "../../hooks/useMonitorInactividad";
import AvisoInactividad from "../../componentes/AvisoInactividad/AvisoInactividad";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

// Context for dashboard layout (kept for backward compat)
const ContextoPanel = createContext();
export const usarPanel = () => useContext(ContextoPanel);

const PanelPrincipal = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { user, loading, cerrarSesion } = useAutenticacion();
  const navigate = useNavigate();
  const location = useLocation();

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
    timeout: 900000,
    warningTime: 60000,
    onTimeout: handleInactivityLogout,
    enabled: !loading && !!user,
  });

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    if (window.innerWidth < 768) setSidebarOpen(false);
  }, [location.pathname]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--fondo)]">
        <h1 className="text-[var(--texto-principal)] font-[family-name:var(--fuente-encabezado)]">
          Cargando Panel...
        </h1>
      </div>
    );
  }

  return (
    <>
      <ContextoPanel.Provider value={{ isSidebarOpen, toggleSidebar }}>
        <SidebarProvider>
          <PanelBarraLateral />
          <SidebarInset>
            <PanelCabecera />
            <div className="p-8 flex-1 overflow-y-auto bg-[var(--fondo-elevado)]">
              <Outlet />
            </div>
          </SidebarInset>
        </SidebarProvider>
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
