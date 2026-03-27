import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAutenticacion } from "../../contextos/ContextoAutenticacion";
import { usarPanel } from "./PanelPrincipal";
import { CARACTERISTICAS } from "../../configuracion/caracteristicas";
import {
  ChartBar, Users, Car, Wrench, Receipt, UserGear, SignOut,
  Package, CalendarDots, ChartLine, Images, Newspaper, Star,
  Question, Tag, Sliders, CaretLeft, CaretRight
} from "@phosphor-icons/react";

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
      { etiqueta: "Vehiculos", icono: Car, ruta: "/panel/vehiculos", roles: ["admin", "empleado"] },
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
      { etiqueta: "Galeria", icono: Images, ruta: "/panel/admin/galeria", roles: ["admin"] },
      { etiqueta: "Testimonios", icono: Star, ruta: "/panel/admin/testimonios", roles: ["admin"] },
      { etiqueta: "Preguntas", icono: Question, ruta: "/panel/admin/preguntas", roles: ["admin"] },
      { etiqueta: "Precios", icono: Tag, ruta: "/panel/admin/precios", roles: ["admin"] },
      { etiqueta: "Configuracion", icono: Sliders, ruta: "/panel/admin/configuracion", roles: ["admin"] },
    ],
  },
  {
    titulo: "Sistema",
    items: [
      { etiqueta: "Usuarios", icono: UserGear, ruta: "/panel/usuarios", roles: ["admin"] },
    ],
  },
];

const PanelBarraLateral = () => {
  const { user, logout: cerrarSesion } = useAutenticacion();
  const { isSidebarOpen, toggleSidebar } = usarPanel();
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
    if (ruta === "/panel") {
      return location.pathname === "/panel";
    }
    return location.pathname === ruta || location.pathname.startsWith(ruta + "/");
  };

  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen z-50
        bg-[var(--fondo)] border-r border-[var(--borde)]
        transition-all duration-300 ease-in-out
        overflow-y-auto overflow-x-hidden
        flex flex-col
        ${isSidebarOpen ? "w-[260px]" : "w-[80px]"}
      `}
    >
      {/* Logo / Header */}
      <div className="p-4 border-b border-[var(--borde)] flex items-center justify-between shrink-0 relative">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[var(--acento)] flex items-center justify-center shrink-0 text-white font-bold text-sm">
            LM
          </div>
          {isSidebarOpen && (
            <span className="font-bold text-[var(--texto-principal)] text-base whitespace-nowrap overflow-hidden text-ellipsis">
              LoyolaMotors
            </span>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={toggleSidebar}
          className={`
            absolute -right-3 top-1/2 -translate-y-1/2
            w-6 h-6 rounded-full
            bg-[var(--fondo-elevado)] border border-[var(--borde)]
            flex items-center justify-center
            text-[var(--texto-secundario)] hover:text-[var(--texto-principal)]
            transition-colors duration-200
            z-10
          `}
          title={isSidebarOpen ? "Contraer" : "Expandir"}
        >
          {isSidebarOpen ? (
            <CaretLeft size={12} weight="bold" />
          ) : (
            <CaretRight size={12} weight="bold" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2">
        {secciones.map((seccion) => {
          // Check section visibility (for toggle-gated sections)
          if (seccion.visible && !seccion.visible()) return null;

          const itemsVisibles = seccion.items.filter(
            (item) => tieneRol(item.roles) && estaActivo(item.requiere)
          );

          if (itemsVisibles.length === 0) return null;

          return (
            <div key={seccion.titulo}>
              {/* Section title - only shown when sidebar is open */}
              {isSidebarOpen && (
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--texto-deshabilitado)] px-4 py-2 mt-4">
                  {seccion.titulo}
                </p>
              )}
              {/* Divider when collapsed */}
              {!isSidebarOpen && (
                <div className="mx-4 my-2 border-t border-[var(--borde)]" />
              )}

              <ul className="list-none m-0 p-0">
                {itemsVisibles.map((item) => {
                  const Icono = item.icono;
                  const activo = esActivo(item.ruta);

                  return (
                    <li key={item.ruta}>
                      <Link
                        to={item.ruta}
                        title={!isSidebarOpen ? item.etiqueta : undefined}
                        className={`
                          flex items-center gap-3 px-4 py-3 mx-2 rounded-[var(--radio-md)]
                          text-[var(--texto-secundario)] transition-all duration-200
                          hover:bg-[var(--fondo-elevado)] hover:text-[var(--texto-principal)]
                          no-underline
                          ${activo
                            ? "bg-[var(--fondo-tarjeta)] text-[var(--texto-principal)] border-l-[3px] border-[var(--acento)]"
                            : ""
                          }
                          ${!isSidebarOpen ? "justify-center" : ""}
                        `}
                      >
                        <Icono
                          size={22}
                          weight="duotone"
                          className={activo ? "text-[var(--acento)] shrink-0" : "shrink-0"}
                        />
                        {isSidebarOpen && (
                          <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                            {item.etiqueta}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* User section */}
      <div className="shrink-0 border-t border-[var(--borde)] p-4">
        <div className={`flex items-center gap-3 ${!isSidebarOpen ? "justify-center flex-col" : ""}`}>
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-[var(--acento)] flex items-center justify-center text-white font-semibold text-sm shrink-0">
            {user?.nombre?.charAt(0)?.toUpperCase() || "U"}
          </div>

          {/* Name + role */}
          {isSidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--texto-principal)] whitespace-nowrap overflow-hidden text-ellipsis m-0">
                {user?.nombre} {user?.apellidos}
              </p>
              <p className="text-xs text-[var(--texto-secundario)] whitespace-nowrap overflow-hidden text-ellipsis m-0">
                {user?.rol === "admin" ? "Administrador" : "Empleado"}
              </p>
            </div>
          )}

          {/* Logout button */}
          <button
            onClick={handleCerrarSesion}
            title="Cerrar Sesion"
            className={`
              flex items-center justify-center gap-2 shrink-0
              text-[var(--texto-secundario)] hover:text-red-400
              transition-colors duration-200 bg-transparent border-0 cursor-pointer
              ${isSidebarOpen ? "p-1 rounded" : "p-1 rounded"}
            `}
          >
            <SignOut size={20} weight="duotone" />
            {isSidebarOpen && (
              <span className="text-xs font-medium">Cerrar Sesion</span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default PanelBarraLateral;
