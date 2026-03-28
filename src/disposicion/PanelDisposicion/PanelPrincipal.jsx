import { useEffect, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SidebarLeft } from "@/components/sidebar-left";
import { SidebarRight } from "@/components/sidebar-right";
import { SiteHeader } from "@/components/site-header";
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
        <SidebarLeft />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col gap-4 p-4">
            <Outlet />
          </div>
        </SidebarInset>
        <SidebarRight />
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
