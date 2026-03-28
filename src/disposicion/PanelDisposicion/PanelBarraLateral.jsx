import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAutenticacion } from "../../contextos/ContextoAutenticacion";
import { CARACTERISTICAS } from "../../configuracion/caracteristicas";
import {
  ChartBar, Users, Car, Wrench, Receipt, UserGear, SignOut,
  Package, CalendarDots, ChartLine, Images, Newspaper, Star,
  Question, Tag, Sliders, House, CaretRight, CaretUpDown,
  GearSix, UserCircle
} from "@phosphor-icons/react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

// ============================================================
// DATA — Navegación del taller adaptada al patrón shadcn
// ============================================================
const navegacionPrincipal = [
  {
    titulo: "Taller",
    icono: Wrench,
    roles: ["admin", "empleado"],
    items: [
      { titulo: "Clientes", ruta: "/panel/clientes", roles: ["admin", "empleado"] },
      { titulo: "Vehículos", ruta: "/panel/vehiculos", roles: ["admin", "empleado"] },
      { titulo: "Servicios", ruta: "/panel/servicios", roles: ["admin", "empleado"] },
      { titulo: "Facturas", ruta: "/panel/facturas", roles: ["admin", "empleado"] },
    ],
  },
  {
    titulo: "Contenido Web",
    icono: Images,
    roles: ["admin"],
    items: [
      { titulo: "Diapositivas", ruta: "/panel/admin/diapositivas", roles: ["admin"] },
      { titulo: "Servicios Web", ruta: "/panel/admin/servicios", roles: ["admin"] },
      { titulo: "Blog", ruta: "/panel/admin/blog", roles: ["admin"] },
      { titulo: "Equipo", ruta: "/panel/admin/equipo", roles: ["admin"] },
      { titulo: "Galería", ruta: "/panel/admin/galeria", roles: ["admin"] },
      { titulo: "Testimonios", ruta: "/panel/admin/testimonios", roles: ["admin"] },
      { titulo: "Preguntas", ruta: "/panel/admin/preguntas", roles: ["admin"] },
      { titulo: "Precios", ruta: "/panel/admin/precios", roles: ["admin"] },
    ],
  },
  {
    titulo: "Sistema",
    icono: GearSix,
    roles: ["admin"],
    items: [
      { titulo: "Usuarios", ruta: "/panel/usuarios", roles: ["admin"] },
      { titulo: "Configuración", ruta: "/panel/admin/configuracion", roles: ["admin"] },
    ],
  },
];

const enlacesDirectos = [
  { titulo: "Panel", icono: ChartBar, ruta: "/panel", roles: ["admin", "empleado"] },
];

const enlacesAvanzados = [
  { titulo: "Repuestos", icono: Package, ruta: "/panel/repuestos", roles: ["admin"], requiere: "INVENTARIO_ACTIVO" },
  { titulo: "Citas", icono: CalendarDots, ruta: "/panel/citas", roles: ["admin", "empleado"], requiere: "CITAS_ONLINE" },
  { titulo: "Reportes", icono: ChartLine, ruta: "/panel/reportes", roles: ["admin"], requiere: "REPORTES_ACTIVOS" },
];

// ============================================================
// NavPrincipal — Collapsible groups con submenu (patrón shadcn)
// ============================================================
function NavPrincipal({ items, tieneRol, esActivo }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          if (!tieneRol(item.roles)) return null;
          const itemsVisibles = item.items.filter((sub) => tieneRol(sub.roles));
          if (itemsVisibles.length === 0) return null;
          const algunoActivo = itemsVisibles.some((sub) => esActivo(sub.ruta));
          const Icono = item.icono;

          return (
            <Collapsible
              key={item.titulo}
              asChild
              defaultOpen={algunoActivo}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.titulo}>
                    <Icono size={18} weight="duotone" />
                    <span>{item.titulo}</span>
                    <CaretRight
                      size={14}
                      className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {itemsVisibles.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.ruta}>
                        <SidebarMenuSubButton asChild isActive={esActivo(subItem.ruta)}>
                          <Link to={subItem.ruta}>
                            <span>{subItem.titulo}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

// ============================================================
// NavDirecta — Links directos sin submenu (Panel, Citas, etc.)
// ============================================================
function NavDirecta({ items, tieneRol, esActivo, label }) {
  const visibles = items.filter((item) => tieneRol(item.roles));
  if (visibles.length === 0) return null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {visibles.map((item) => {
          const Icono = item.icono;
          return (
            <SidebarMenuItem key={item.ruta}>
              <SidebarMenuButton asChild isActive={esActivo(item.ruta)} tooltip={item.titulo}>
                <Link to={item.ruta}>
                  <Icono size={18} weight={esActivo(item.ruta) ? "fill" : "duotone"} />
                  <span>{item.titulo}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

// ============================================================
// NavUsuario — Footer con DropdownMenu (patrón shadcn exacto)
// ============================================================
function NavUsuario({ user, onCerrarSesion }) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  {user?.nombre?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user?.nombre} {user?.apellidos}
                </span>
                <span className="truncate text-xs">
                  {user?.email}
                </span>
              </div>
              <CaretUpDown size={16} className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      {user?.nombre?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {user?.nombre} {user?.apellidos}
                    </span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to="/panel/admin/configuracion">
                  <GearSix size={16} />
                  Configuración
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/">
                  <House size={16} />
                  Volver al sitio
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={onCerrarSesion}>
                <SignOut size={16} />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

// ============================================================
// COMPONENTE PRINCIPAL — AppSidebar (estructura idéntica al demo)
// ============================================================
const PanelBarraLateral = () => {
  const { user, cerrarSesion } = useAutenticacion();
  const location = useLocation();
  const navigate = useNavigate();

  const tieneRol = (roles) => {
    if (!user) return false;
    return roles.includes(user.rol) || user.rol === "admin";
  };

  const esActivo = (ruta) => {
    if (ruta === "/panel") return location.pathname === "/panel";
    return location.pathname === ruta || location.pathname.startsWith(ruta + "/");
  };

  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate("/inicio-sesion", { replace: true });
  };

  // Filter enlaces avanzados by feature flags
  const avanzadosActivos = enlacesAvanzados.filter(
    (item) => CARACTERISTICAS[item.requiere] === true
  );

  return (
    <Sidebar collapsible="icon">
      {/* Header: Logo (patrón TeamSwitcher del demo) */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/panel">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground overflow-hidden">
                  <img
                    src="/assets/img/icon/loyola-logo-v2.png"
                    alt="Loyola Motors"
                    className="size-6 object-contain"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Loyola Motors</span>
                  <span className="truncate text-xs">Panel de Control</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        {/* Links directos: Panel */}
        <NavDirecta
          items={enlacesDirectos}
          tieneRol={tieneRol}
          esActivo={esActivo}
          label="Principal"
        />

        {/* Collapsible groups: Taller, Contenido Web, Sistema */}
        <NavPrincipal
          items={navegacionPrincipal}
          tieneRol={tieneRol}
          esActivo={esActivo}
        />

        {/* Links directos avanzados (feature-flagged) */}
        {avanzadosActivos.length > 0 && (
          <NavDirecta
            items={avanzadosActivos}
            tieneRol={tieneRol}
            esActivo={esActivo}
            label="Avanzado"
          />
        )}
      </SidebarContent>

      {/* Footer: User dropdown (patrón NavUser del demo) */}
      <SidebarFooter>
        <NavUsuario user={user} onCerrarSesion={handleCerrarSesion} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

export default PanelBarraLateral;
