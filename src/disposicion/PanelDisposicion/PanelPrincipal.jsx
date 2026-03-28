import { useEffect, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import PanelBarraLateral from "./PanelBarraLateral";
import PanelCabecera from "./PanelCabecera";
import { useAutenticacion } from "../../contextos/ContextoAutenticacion";
import useMonitorInactividad from "../../hooks/useMonitorInactividad";
import AvisoInactividad from "../../componentes/AvisoInactividad/AvisoInactividad";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

const PanelPrincipal = () => {
  const { user, loading, cerrarSesion } = useAutenticacion();
  const navigate = useNavigate();

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

  if (loading || !user) {
    return (
      <div className="dark flex items-center justify-center h-screen bg-background">
        <h1 className="text-foreground font-[family-name:var(--fuente-encabezado)]">
          Cargando Panel...
        </h1>
      </div>
    );
  }

  return (
    <>
      <SidebarProvider className="dark">
        <PanelBarraLateral />
        <SidebarInset>
          <PanelCabecera />
          <div className="p-8 flex-1 overflow-y-auto bg-muted">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
      <AvisoInactividad
        isVisible={isWarning}
        remainingSeconds={remainingSeconds}
        onStayLoggedIn={resetTimer}
      />
    </>
  );
};

export default PanelPrincipal;
