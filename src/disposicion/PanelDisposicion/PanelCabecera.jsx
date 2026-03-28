import { useNavigate, useLocation } from "react-router-dom";
import { useAutenticacion } from "../../contextos/ContextoAutenticacion";
import { SignOut, UserCircle, GearSix } from "@phosphor-icons/react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Mapa de rutas a titulos legibles
const titulos = {
  "/panel": "Panel Principal",
  "/panel/clientes": "Gestion de Clientes",
  "/panel/vehiculos": "Gestion de Vehiculos",
  "/panel/servicios": "Gestion de Servicios",
  "/panel/facturas": "Facturacion",
  "/panel/usuarios": "Gestion de Usuarios",
  "/panel/repuestos": "Inventario de Repuestos",
  "/panel/citas": "Agenda de Citas",
  "/panel/reportes": "Reportes",
  "/panel/admin/diapositivas": "Diapositivas del Sitio",
  "/panel/admin/servicios": "Servicios del Sitio",
  "/panel/admin/blog": "Gestion de Blog",
  "/panel/admin/equipo": "Equipo del Taller",
  "/panel/admin/galeria": "Galeria de Imagenes",
  "/panel/admin/testimonios": "Testimonios",
  "/panel/admin/preguntas": "Preguntas Frecuentes",
  "/panel/admin/precios": "Tabla de Precios",
  "/panel/admin/configuracion": "Configuracion del Sitio",
};

const capitalize = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const PanelCabecera = () => {
  const { user, cerrarSesion } = useAutenticacion();
  const navigate = useNavigate();
  const location = useLocation();

  const pageTitle = titulos[location.pathname] || "Panel";

  // Generar migas de pan a partir de la ruta
  const segments = location.pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((seg, index) => {
    const path = "/" + segments.slice(0, index + 1).join("/");
    const label = titulos[path] ? titulos[path] : capitalize(seg);
    const isLast = index === segments.length - 1;
    return { label, path, isLast };
  });

  const handleLogout = () => {
    cerrarSesion();
    navigate("/inicio-sesion", { replace: true });
  };

  const userInitial = user?.nombre?.charAt(0)?.toUpperCase() || "U";
  const userName = user?.nombre || "Usuario";

  return (
    <header className="bg-background border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Seccion izquierda: toggle + titulo + migas */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground hover:bg-muted" />
          <Separator orientation="vertical" className="mr-2 h-4 bg-border" />

          <div className="flex flex-col">
            <h1 className="text-xl font-semibold text-foreground font-[family-name:var(--fuente-encabezado)]">
              {pageTitle}
            </h1>
            {breadcrumbs.length > 1 && (
              <Breadcrumb>
                <BreadcrumbList className="text-[var(--texto-deshabilitado)]">
                  {breadcrumbs.map((crumb, index) => (
                    <BreadcrumbItem key={crumb.path}>
                      {index > 0 && <BreadcrumbSeparator />}
                      {crumb.isLast ? (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          className="cursor-pointer"
                          onClick={() => navigate(crumb.path)}
                        >
                          {crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            )}
          </div>
        </div>

        {/* Seccion derecha: menu de usuario */}
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label="Menu de usuario"
                className="flex items-center gap-2 px-3 py-2 rounded-[var(--radio-md)] hover:bg-muted transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm">
                  {userInitial}
                </div>
                <span className="text-sm font-medium text-foreground hidden sm:block">
                  {userName}
                </span>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-72">
              {/* Encabezado del dropdown con datos del usuario */}
              <DropdownMenuLabel className="flex items-center gap-3 px-4 py-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                  {userInitial}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-foreground truncate">
                    {user?.nombre} {user?.apellidos}
                  </span>
                  <span className="text-xs text-muted-foreground truncate font-normal">
                    {user?.email}
                  </span>
                  <span className="text-xs text-primary font-medium uppercase mt-0.5">
                    {user?.rol === "admin" ? "Administrador" : "Empleado"}
                  </span>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              {/* Opciones del menu */}
              <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 cursor-pointer">
                <UserCircle size={18} className="text-muted-foreground" />
                Mi Perfil
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-3 px-4 py-2.5 cursor-pointer"
                onClick={() => navigate("/panel/admin/configuracion")}
              >
                <GearSix size={18} className="text-muted-foreground" />
                Configuracion
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="flex items-center gap-3 px-4 py-2.5 text-red-500 focus:text-red-500 cursor-pointer"
                onClick={handleLogout}
              >
                <SignOut size={18} />
                Cerrar Sesion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default PanelCabecera;
