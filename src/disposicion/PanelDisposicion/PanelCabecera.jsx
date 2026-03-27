import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAutenticacion } from "../../contextos/ContextoAutenticacion";
import { usarPanel } from "./PanelPrincipal";
import { List, Bell, SignOut, UserCircle, GearSix } from "@phosphor-icons/react";

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
  const { user, logout } = useAutenticacion();
  const { toggleSidebar } = usarPanel();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  const pageTitle = titulos[location.pathname] || "Panel";

  // Generate breadcrumbs from pathname
  const segments = location.pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((seg, index) => {
    const path = "/" + segments.slice(0, index + 1).join("/");
    const label = titulos[path] ? titulos[path] : capitalize(seg);
    const isLast = index === segments.length - 1;
    return { label, path, isLast };
  });

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
    navigate("/login", { replace: true });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  const userInitial = user?.nombre?.charAt(0)?.toUpperCase() || "U";
  const userName = user?.nombre || "Usuario";

  return (
    <header className="bg-[var(--fondo)] border-b border-[var(--borde)] px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left section: toggle + title + breadcrumbs */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            className="p-2 rounded-[var(--radio-md)] hover:bg-[var(--fondo-elevado)] text-[var(--texto-secundario)] transition-colors"
          >
            <List size={24} />
          </button>

          <div className="flex flex-col">
            <h1 className="text-xl font-semibold text-[var(--texto-principal)] font-[family-name:var(--fuente-encabezado)]">
              {pageTitle}
            </h1>
            {breadcrumbs.length > 1 && (
              <nav className="flex items-center gap-1 text-sm text-[var(--texto-deshabilitado)]">
                {breadcrumbs.map((crumb, index) => (
                  <span key={crumb.path} className="flex items-center gap-1">
                    {index > 0 && <span className="select-none">&gt;</span>}
                    {crumb.isLast ? (
                      <span>{crumb.label}</span>
                    ) : (
                      <button
                        onClick={() => navigate(crumb.path)}
                        className="hover:text-[var(--texto-secundario)] transition-colors"
                      >
                        {crumb.label}
                      </button>
                    )}
                  </span>
                ))}
              </nav>
            )}
          </div>
        </div>

        {/* Right section: user menu */}
        <div className="flex items-center gap-3">
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              aria-label="Menu de usuario"
              className="flex items-center gap-2 px-3 py-2 rounded-[var(--radio-md)] hover:bg-[var(--fondo-elevado)] transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-[var(--acento)] flex items-center justify-center text-white font-semibold text-sm">
                {userInitial}
              </div>
              <span className="text-sm font-medium text-[var(--texto-principal)] hidden sm:block">
                {userName}
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-72 z-50 bg-[var(--fondo-elevado)] border border-[var(--borde)] rounded-[var(--radio-lg)] shadow-xl overflow-hidden">
                {/* Dropdown header */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-[var(--borde)]">
                  <div className="w-12 h-12 rounded-full bg-[var(--acento)] flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                    {userInitial}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-[var(--texto-principal)] truncate">
                      {user?.nombre} {user?.apellidos}
                    </span>
                    <span className="text-xs text-[var(--texto-secundario)] truncate">
                      {user?.email}
                    </span>
                    <span className="text-xs text-[var(--acento)] font-medium uppercase mt-0.5">
                      {user?.rol === "admin" ? "Administrador" : "Empleado"}
                    </span>
                  </div>
                </div>

                {/* Dropdown items */}
                <div className="p-2 flex flex-col gap-0.5">
                  <button
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-[var(--radio-md)] text-sm text-[var(--texto-principal)] hover:bg-[var(--fondo)] transition-colors text-left"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <UserCircle size={18} className="text-[var(--texto-secundario)]" />
                    Mi Perfil
                  </button>
                  <button
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-[var(--radio-md)] text-sm text-[var(--texto-principal)] hover:bg-[var(--fondo)] transition-colors text-left"
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate("/panel/admin/configuracion");
                    }}
                  >
                    <GearSix size={18} className="text-[var(--texto-secundario)]" />
                    Configuracion
                  </button>

                  <div className="my-1 h-px bg-[var(--borde)]" />

                  <button
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-[var(--radio-md)] text-sm text-red-500 hover:bg-red-500/10 transition-colors text-left"
                    onClick={handleLogout}
                  >
                    <SignOut size={18} />
                    Cerrar Sesion
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default PanelCabecera;
