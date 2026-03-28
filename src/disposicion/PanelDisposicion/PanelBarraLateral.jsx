import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAutenticacion } from "../../contextos/ContextoAutenticacion";
import { CARACTERISTICAS } from "../../configuracion/caracteristicas";
import {
  ChartBar, Users, Car, Wrench, Receipt, UserGear, SignOut,
  Package, CalendarDots, ChartLine, Images, Newspaper, Star,
  Question, Tag, Sliders, House
} from "@phosphor-icons/react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

// ============================================================
// CONFIGURACIÓN DE MENÚ
// ============================================================
const secciones = [
  {
    titulo: "Principal",
    items: [
      { etiqueta: "Panel", icono: ChartBar, ruta: "/panel", roles: ["admin", "empleado"] },
    ],
  },
  {
    titulo: "Taller",
    items: [
      { etiqueta: "Clientes", icono: Users, ruta: "/panel/clientes", roles: ["admin", "empleado"] },
      { etiqueta: "Vehículos", icono: Car, ruta: "/panel/vehiculos", roles: ["admin", "empleado"] },
      { etiqueta: "Servicios", icono: Wrench, ruta: "/panel/servicios", roles: ["admin", "empleado"] },
      { etiqueta: "Facturas", icono: Receipt, ruta: "/panel/facturas", roles: ["admin", "empleado"] },
    ],
  },
  {
    titulo: "Avanzado",
    visible: () =>
      CARACTERISTICAS.INVENTARIO_ACTIVO ||
      CARACTERISTICAS.CITAS_ONLINE ||
      CARACTERISTICAS.REPORTES_ACTIVOS,
    items: [
      { etiqueta: "Repuestos", icono: Package, ruta: "/panel/repuestos", roles: ["admin"], requiere: "INVENTARIO_ACTIVO" },
      { etiqueta: "Citas", icono: CalendarDots, ruta: "/panel/citas", roles: ["admin", "empleado"], requiere: "CITAS_ONLINE" },
      { etiqueta: "Reportes", icono: ChartLine, ruta: "/panel/reportes", roles: ["admin"], requiere: "REPORTES_ACTIVOS" },
    ],
  },
  {
    titulo: "Contenido Web",
    items: [
      { etiqueta: "Diapositivas", icono: Images, ruta: "/panel/admin/diapositivas", roles: ["admin"] },
      { etiqueta: "Servicios Web", icono: Wrench, ruta: "/panel/admin/servicios", roles: ["admin"] },
      { etiqueta: "Blog", icono: Newspaper, ruta: "/panel/admin/blog", roles: ["admin"] },
      { etiqueta: "Equipo", icono: Users, ruta: "/panel/admin/equipo", roles: ["admin"] },
      { etiqueta: "Galería", icono: Images, ruta: "/panel/admin/galeria", roles: ["admin"] },
      { etiqueta: "Testimonios", icono: Star, ruta: "/panel/admin/testimonios", roles: ["admin"] },
      { etiqueta: "Preguntas", icono: Question, ruta: "/panel/admin/preguntas", roles: ["admin"] },
      { etiqueta: "Precios", icono: Tag, ruta: "/panel/admin/precios", roles: ["admin"] },
      { etiqueta: "Configuración", icono: Sliders, ruta: "/panel/admin/configuracion", roles: ["admin"] },
    ],
  },
  {
    titulo: "Sistema",
    items: [
      { etiqueta: "Usuarios", icono: UserGear, ruta: "/panel/usuarios", roles: ["admin"] },
    ],
  },
];

// ============================================================
// COMPONENTE SIDEBAR — 100% spec shadcn/ui
// ============================================================
const PanelBarraLateral = () => {
  const { user, cerrarSesion } = useAutenticacion();
  const location = useLocation();
  const navigate = useNavigate();

  const tieneRol = (roles) => {
    if (!user) return false;
    return roles.includes(user.rol) || user.rol === "admin";
  };

  const estaActivo = (requiere) => {
    if (!requiere) return true;
    return CARACTERISTICAS[requiere] === true;
  };

  const esActivo = (ruta) => {
    if (ruta === "/panel") return location.pathname === "/panel";
    return location.pathname === ruta || location.pathname.startsWith(ruta + "/");
  };

  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate("/inicio-sesion", { replace: true });
  };

  return (
    <Sidebar collapsible="icon">
      {/* ── Header: Logo ── */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/panel">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden">
                  <img
                    src="/assets/img/icon/loyola-logo-v2.png"
                    alt="Loyola Motors"
                    className="size-8 object-contain"
                  />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Loyola Motors</span>
                  <span className="text-xs text-sidebar-foreground/60">Panel de Control</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ── Content: Secciones de navegación ── */}
      <SidebarContent>
        {secciones.map((seccion) => {
          if (seccion.visible && !seccion.visible()) return null;

          const itemsVisibles = seccion.items.filter(
            (item) => tieneRol(item.roles) && estaActivo(item.requiere)
          );

          if (itemsVisibles.length === 0) return null;

          return (
            <SidebarGroup key={seccion.titulo}>
              <SidebarGroupLabel>{seccion.titulo}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {itemsVisibles.map((item) => {
                    const Icono = item.icono;
                    const activo = esActivo(item.ruta);

                    return (
                      <SidebarMenuItem key={item.ruta}>
                        <SidebarMenuButton asChild isActive={activo} tooltip={item.etiqueta}>
                          <Link to={item.ruta}>
                            <Icono size={20} weight={activo ? "fill" : "regular"} />
                            <span>{item.etiqueta}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      {/* ── Footer: Usuario + acciones ── */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Volver al sitio">
              <Link to="/">
                <House size={20} weight="duotone" />
                <span>Volver al sitio</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground font-semibold text-sm">
                {user?.nombre?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold text-sm truncate">
                  {user?.nombre} {user?.apellidos}
                </span>
                <span className="text-xs text-sidebar-foreground/60 truncate">
                  {user?.rol === "admin" ? "Administrador" : "Empleado"}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Cerrar sesión" onClick={handleCerrarSesion}>
              <SignOut size={20} weight="duotone" />
              <span>Cerrar sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

export default PanelBarraLateral;
