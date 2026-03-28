import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAutenticacion } from "../../contextos/ContextoAutenticacion";
import { usarPanel } from "./PanelPrincipal";
import { CARACTERISTICAS } from "../../configuracion/caracteristicas";
import {
  ChartBar, Users, Car, Wrench, Receipt, UserGear, SignOut,
  Package, CalendarDots, ChartLine, Images, Newspaper, Star,
  Question, Tag, Sliders, CaretLeft, CaretRight, House
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
  useSidebar,
} from "@/components/ui/sidebar";

// ============================================================
// CONFIGURACIÓN DE MENÚ — Secciones y items del sidebar
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
// COMPONENTE SIDEBAR — shadcn/ui Sidebar con estructura del taller
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
    <Sidebar collapsible="icon" className="border-r border-[var(--borde)]">
      {/* ── Header: Logo ── */}
      <SidebarHeader className="border-b border-[var(--borde)] bg-[var(--fondo)]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-transparent active:bg-transparent">
              <Link to="/panel" className="no-underline">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden bg-transparent">
                  <img
                    src="/assets/img/icon/loyola-logo-v2.png"
                    alt="Loyola Motors"
                    className="size-8 object-contain"
                  />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-bold text-[var(--texto-principal)] text-sm">Loyola Motors</span>
                  <span className="text-xs text-[var(--texto-secundario)]">Panel de Control</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ── Content: Secciones de navegación ── */}
      <SidebarContent className="bg-[var(--fondo)]">
        {secciones.map((seccion) => {
          if (seccion.visible && !seccion.visible()) return null;

          const itemsVisibles = seccion.items.filter(
            (item) => tieneRol(item.roles) && estaActivo(item.requiere)
          );

          if (itemsVisibles.length === 0) return null;

          return (
            <SidebarGroup key={seccion.titulo}>
              <SidebarGroupLabel className="text-[var(--texto-deshabilitado)] uppercase tracking-wider text-xs font-semibold">
                {seccion.titulo}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {itemsVisibles.map((item) => {
                    const Icono = item.icono;
                    const activo = esActivo(item.ruta);

                    return (
                      <SidebarMenuItem key={item.ruta}>
                        <SidebarMenuButton
                          asChild
                          isActive={activo}
                          tooltip={item.etiqueta}
                          className={activo
                            ? "bg-[var(--fondo-tarjeta)] text-[var(--acento)] border-l-[3px] border-[var(--acento)] font-semibold"
                            : "text-[var(--texto-secundario)] hover:bg-[var(--fondo-elevado)] hover:text-[var(--texto-principal)]"
                          }
                        >
                          <Link to={item.ruta} className="no-underline">
                            <Icono size={20} weight={activo ? "duotone" : "regular"} />
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

      {/* ── Footer: Usuario + Cerrar Sesión + Volver al sitio ── */}
      <SidebarFooter className="border-t border-[var(--borde)] bg-[var(--fondo)]">
        <SidebarMenu>
          {/* Volver al sitio */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Volver al sitio" className="text-[var(--texto-secundario)] hover:text-green-400 hover:bg-[var(--fondo-elevado)]">
              <Link to="/" className="no-underline">
                <House size={20} weight="duotone" />
                <span>Volver al sitio</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Usuario */}
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="cursor-default hover:bg-transparent active:bg-transparent">
              <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-[var(--acento)] text-white font-semibold text-sm shrink-0">
                {user?.nombre?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="flex flex-col gap-0.5 leading-none min-w-0">
                <span className="text-sm font-semibold text-[var(--texto-principal)] truncate">
                  {user?.nombre} {user?.apellidos}
                </span>
                <span className="text-xs text-[var(--texto-secundario)] truncate">
                  {user?.rol === "admin" ? "Administrador" : "Empleado"}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Cerrar sesión */}
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Cerrar sesión"
              onClick={handleCerrarSesion}
              className="text-[var(--texto-secundario)] hover:text-red-400 hover:bg-red-500/10"
            >
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
