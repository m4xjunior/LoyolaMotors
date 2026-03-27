# Rediseno Panel de Administracion - Plan de Implementacion

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the entire LoyolaMotors admin dashboard from junior-quality (emojis, inline styles, mixed styling) to production-grade (Phosphor Icons, shadcn/ui, Tailwind CSS, CRUD-ready service layer, CMS for public site content).

**Architecture:** Service layer pattern — all data access goes through `src/servicios/` modules with full CRUD signatures. Components never access data directly. Feature toggles gate unreleased functionality. Public site content editable from admin panel via `servicioContenido`. Everything named in castellano (Spanish).

**Tech Stack:** React 18, Vite, Tailwind CSS v4, shadcn/ui, Phosphor Icons, Recharts, date-fns, react-hook-form. Target deployment: Tauri (Rust) with Prisma + PostgreSQL backend (future).

**Spec:** `docs/superpowers/specs/2026-03-27-rediseno-panel-administracion-design.md`

**Working directory:** `/Users/maxmeireles/Downloads/LoyolaMotors/.claude/worktrees/cranky-shannon`

---

## FASE 1: Infraestructura (secuencial, bloqueante)

### Task 1: Instalar dependencias y actualizar tokens de diseno

**Files:**
- Modify: `package.json`
- Modify: `src/globals.css`
- Modify: `index.html` (tipografia Google Fonts)

- [ ] **Step 1: Instalar Phosphor Icons y Recharts**

```bash
npm install @phosphor-icons/react recharts
```

- [ ] **Step 2: Agregar Google Fonts al index.html**

En `index.html`, dentro de `<head>`, agregar antes de los otros links:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Fira+Sans:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

- [ ] **Step 3: Actualizar tokens en globals.css**

Agregar al inicio de `src/globals.css` (despues de los imports existentes de Tailwind), dentro de `:root` o `@theme`:

```css
/* === Tokens Automotive Industrial Dark === */
:root {
  /* Fondos */
  --fondo: #0F172A;
  --fondo-tarjeta: #1E293B;
  --fondo-elevado: #334155;

  /* Texto */
  --texto-principal: #F8FAFC;
  --texto-secundario: #94A3B8;
  --texto-deshabilitado: #64748B;

  /* Acentos */
  --acento: #DC2626;
  --acento-hover: #B91C1C;
  --exito: #22C55E;
  --advertencia: #F59E0B;
  --peligro: #EF4444;
  --info: #3B82F6;

  /* Bordes */
  --borde: #334155;
  --borde-enfoque: #DC2626;

  /* Radios */
  --radio-sm: 6px;
  --radio-md: 8px;
  --radio-lg: 12px;
  --radio-xl: 16px;

  /* Tipografia */
  --fuente-encabezado: 'Inter', sans-serif;
  --fuente-cuerpo: 'Fira Sans', sans-serif;
  --fuente-datos: 'Fira Code', monospace;
}
```

- [ ] **Step 4: Verificar build**

```bash
npx vite build
```

Expected: Build passes. Chunk size warning is pre-existing and acceptable.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/globals.css index.html
git commit -m "feat: instalar Phosphor Icons + Recharts, agregar tokens de diseno automotive"
```

---

### Task 2: Crear capa de servicios CRUD y feature toggles

**Files:**
- Create: `src/configuracion/caracteristicas.js`
- Create: `src/servicios/servicioClientes.js`
- Create: `src/servicios/servicioVehiculos.js`
- Create: `src/servicios/servicioServicios.js`
- Create: `src/servicios/servicioFacturas.js`
- Create: `src/servicios/servicioUsuarios.js`
- Create: `src/servicios/servicioRepuestos.js`
- Create: `src/servicios/servicioCitas.js`
- Create: `src/servicios/servicioReportes.js`
- Create: `src/servicios/servicioContenido.js`
- Create: `src/servicios/servicioConfiguracion.js`

- [ ] **Step 1: Crear feature toggles**

```js
// src/configuracion/caracteristicas.js
export const CARACTERISTICAS = {
  BASE_DATOS_ACTIVA:       false,
  NOTIFICACIONES_ACTIVAS:  false,
  REPORTES_ACTIVOS:        false,
  FACTURACION_ELECTRONICA: false,
  CITAS_ONLINE:            false,
  INVENTARIO_ACTIVO:       false,
  CMS_ACTIVO:              true,   // CMS siempre activo para admin
};
```

- [ ] **Step 2: Crear servicio base para entidades del taller**

Cada servicio sigue este patron exacto. Ejemplo para clientes:

```js
// src/servicios/servicioClientes.js

const CLAVE_ALMACEN = 'loyola_clientes';

const obtenerAlmacen = () => {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_ALMACEN) || '[]');
  } catch { return []; }
};

const guardarAlmacen = (datos) => {
  localStorage.setItem(CLAVE_ALMACEN, JSON.stringify(datos));
};

export const servicioClientes = {
  obtenerTodos: async (filtros = {}) => {
    let datos = obtenerAlmacen();
    if (filtros.termino) {
      const t = filtros.termino.toLowerCase();
      datos = datos.filter(d =>
        d.nombre?.toLowerCase().includes(t) ||
        d.apellidos?.toLowerCase().includes(t) ||
        d.email?.toLowerCase().includes(t)
      );
    }
    return datos;
  },

  obtenerPorId: async (id) => {
    const datos = obtenerAlmacen();
    return datos.find(d => d.id === id) || null;
  },

  crear: async (datos) => {
    const todos = obtenerAlmacen();
    const nuevo = { ...datos, id: crypto.randomUUID(), creadoEn: new Date().toISOString() };
    todos.push(nuevo);
    guardarAlmacen(todos);
    return nuevo;
  },

  actualizar: async (id, datos) => {
    const todos = obtenerAlmacen();
    const indice = todos.findIndex(d => d.id === id);
    if (indice === -1) throw new Error('Cliente no encontrado');
    todos[indice] = { ...todos[indice], ...datos, actualizadoEn: new Date().toISOString() };
    guardarAlmacen(todos);
    return todos[indice];
  },

  eliminar: async (id) => {
    const todos = obtenerAlmacen();
    const filtrados = todos.filter(d => d.id !== id);
    guardarAlmacen(filtrados);
    return true;
  },

  buscar: async (termino) => {
    return servicioClientes.obtenerTodos({ termino });
  },

  contarTodos: async () => {
    return obtenerAlmacen().length;
  },
};
```

Crear los siguientes servicios con el MISMO patron, cambiando solo `CLAVE_ALMACEN` y los campos de busqueda:

| Archivo | CLAVE_ALMACEN | Campos busqueda |
|---|---|---|
| `servicioVehiculos.js` | `loyola_vehiculos` | marca, modelo, matricula |
| `servicioServicios.js` | `loyola_servicios` | tipoServicio, descripcion |
| `servicioFacturas.js` | `loyola_facturas` | numero, clienteNombre |
| `servicioUsuarios.js` | `loyola_usuarios` | nombre, email, rol |
| `servicioRepuestos.js` | `loyola_repuestos` | nombre, codigo, categoria |
| `servicioCitas.js` | `loyola_citas` | clienteNombre, descripcion |
| `servicioReportes.js` | `loyola_reportes` | titulo, tipo |

- [ ] **Step 3: Crear servicioContenido (CMS generico)**

```js
// src/servicios/servicioContenido.js

const obtenerClave = (coleccion) => `loyola_contenido_${coleccion}`;

const obtenerAlmacen = (coleccion) => {
  try {
    return JSON.parse(localStorage.getItem(obtenerClave(coleccion)) || '[]');
  } catch { return []; }
};

const guardarAlmacen = (coleccion, datos) => {
  localStorage.setItem(obtenerClave(coleccion), JSON.stringify(datos));
};

export const COLECCIONES = [
  'diapositivas', 'servicios', 'blog', 'equipo', 'galeria',
  'testimonios', 'preguntas', 'precios', 'estadisticas',
  'pestanasEmpresa', 'logosClientes', 'ofertasCta',
];

export const servicioContenido = {
  obtener: async (coleccion, filtros = {}) => {
    let datos = obtenerAlmacen(coleccion);
    if (filtros.activo !== undefined) {
      datos = datos.filter(d => d.activo === filtros.activo);
    }
    if (filtros.orden) {
      datos.sort((a, b) => (a.orden || 0) - (b.orden || 0));
    }
    return datos;
  },

  obtenerUno: async (coleccion, id) => {
    const datos = obtenerAlmacen(coleccion);
    return datos.find(d => d.id === id) || null;
  },

  guardar: async (coleccion, id, datos) => {
    const todos = obtenerAlmacen(coleccion);
    const indice = todos.findIndex(d => d.id === id);
    if (indice >= 0) {
      todos[indice] = { ...todos[indice], ...datos, actualizadoEn: new Date().toISOString() };
    } else {
      todos.push({ ...datos, id: id || crypto.randomUUID(), creadoEn: new Date().toISOString() });
    }
    guardarAlmacen(coleccion, todos);
    return todos.find(d => d.id === (id || datos.id));
  },

  eliminar: async (coleccion, id) => {
    const todos = obtenerAlmacen(coleccion);
    guardarAlmacen(coleccion, todos.filter(d => d.id !== id));
    return true;
  },

  reordenar: async (coleccion, ids) => {
    const todos = obtenerAlmacen(coleccion);
    const reordenados = ids.map((id, i) => {
      const item = todos.find(d => d.id === id);
      return item ? { ...item, orden: i } : null;
    }).filter(Boolean);
    guardarAlmacen(coleccion, reordenados);
    return reordenados;
  },

  contarTodos: async (coleccion) => {
    return obtenerAlmacen(coleccion).length;
  },
};
```

- [ ] **Step 4: Crear servicioConfiguracion**

```js
// src/servicios/servicioConfiguracion.js

const CLAVE = 'loyola_configuracion';

const CONFIGURACION_POR_DEFECTO = {
  telefono: '+34 640 16 29 47',
  email: 'info@loyolamotors.es',
  direccion: 'C/ Sant Ignasi de Loiola, 21-BJ IZ, 46008 Valencia, Espana',
  horario: 'Lun - Vie: 9:00 - 18:00',
  redesSociales: {
    twitter: 'https://www.x.com/',
    facebook: 'https://www.facebook.com/',
    linkedin: 'https://www.linkedin.com/',
    instagram: '',
  },
  videoYoutube: 'VcaAVWtP48A',
  nombreEmpresa: 'Loyola Motors',
  eslogan: 'Taller de Chapa y Pintura en Valencia',
};

export const servicioConfiguracion = {
  obtener: async () => {
    try {
      const guardado = JSON.parse(localStorage.getItem(CLAVE) || 'null');
      return { ...CONFIGURACION_POR_DEFECTO, ...guardado };
    } catch {
      return { ...CONFIGURACION_POR_DEFECTO };
    }
  },

  actualizar: async (datos) => {
    const actual = await servicioConfiguracion.obtener();
    const actualizado = { ...actual, ...datos };
    localStorage.setItem(CLAVE, JSON.stringify(actualizado));
    return actualizado;
  },
};
```

- [ ] **Step 5: Verificar build y commit**

```bash
npx vite build
git add src/configuracion/ src/servicios/
git commit -m "feat: crear capa de servicios CRUD (11 servicios) + feature toggles"
```

---

### Task 3: Renombrar archivos a castellano via git mv

**Files:**
- Rename: All dashboard-related files (see mapping below)
- Modify: All import statements across the project

This task is the most delicate. Every `git mv` must be followed by updating ALL imports that reference the old path.

- [ ] **Step 1: Renombrar contextos**

```bash
mkdir -p src/contextos
git mv src/contexts/AuthContext.jsx src/contextos/ContextoAutenticacion.jsx
```

- [ ] **Step 2: Renombrar hooks**

```bash
git mv src/hooks/useInactivityMonitor.js src/hooks/useMonitorInactividad.js
```

- [ ] **Step 3: Renombrar layout del panel**

```bash
mkdir -p src/disposicion/PanelDisposicion
git mv src/layout/DashboardLayout/DashboardMain.jsx src/disposicion/PanelDisposicion/PanelPrincipal.jsx
git mv src/layout/DashboardLayout/DashboardHeader.jsx src/disposicion/PanelDisposicion/PanelCabecera.jsx
git mv src/layout/DashboardLayout/DashboardSidebar.jsx src/disposicion/PanelDisposicion/PanelBarraLateral.jsx
git mv src/layout/Main.jsx src/disposicion/Principal.jsx
git mv src/layout/Header/Header.jsx src/disposicion/Cabecera/Cabecera.jsx
git mv src/layout/Footer/Footer.jsx src/disposicion/PiePagina/PiePagina.jsx
```

- [ ] **Step 4: Renombrar paginas**

```bash
git mv src/pages/DashboardPage.jsx src/paginas/PaginaPanel.jsx
git mv src/pages/ClientesManagementPage.jsx src/paginas/PaginaClientes.jsx
git mv src/pages/NovoClientePage.jsx src/paginas/PaginaNuevoCliente.jsx
git mv src/pages/ClienteDetailPage.jsx src/paginas/PaginaDetalleCliente.jsx
git mv src/pages/VehiclesPage.jsx src/paginas/PaginaVehiculos.jsx
git mv src/pages/NovoVehiculoPage.jsx src/paginas/PaginaNuevoVehiculo.jsx
git mv src/pages/VehicleServicesPage.jsx src/paginas/PaginaServiciosVehiculo.jsx
git mv src/pages/ServicesPage.jsx src/paginas/PaginaServicios.jsx
git mv src/pages/NovoServicoPage.jsx src/paginas/PaginaNuevoServicio.jsx
git mv src/pages/InvoicesPage.jsx src/paginas/PaginaFacturas.jsx
git mv src/pages/UsersManagementPage.jsx src/paginas/PaginaUsuarios.jsx
git mv src/pages/LoginPage.jsx src/paginas/PaginaInicioSesion.jsx
```

Paginas publicas que tambien se renombran:

```bash
git mv src/pages/Home.jsx src/paginas/PaginaInicio.jsx
git mv src/pages/About.jsx src/paginas/PaginaSobreNosotros.jsx
git mv src/pages/Contact.jsx src/paginas/PaginaContacto.jsx
git mv src/pages/Faq.jsx src/paginas/PaginaPreguntas.jsx
git mv src/pages/Gallery.jsx src/paginas/PaginaGaleria.jsx
git mv src/pages/Blog.jsx src/paginas/PaginaBlog.jsx
git mv src/pages/SingleBlog.jsx src/paginas/PaginaArticuloBlog.jsx
git mv src/pages/Service.jsx src/paginas/PaginaServicio.jsx
git mv src/pages/SingleService.jsx src/paginas/PaginaDetalleServicio.jsx
git mv src/pages/Team.jsx src/paginas/PaginaEquipo.jsx
git mv src/pages/TeamMemberDetails.jsx src/paginas/PaginaDetalleMiembro.jsx
git mv src/pages/Testimonial.jsx src/paginas/PaginaTestimonios.jsx
git mv src/pages/Pricing.jsx src/paginas/PaginaPrecios.jsx
git mv src/pages/Appointment.jsx src/paginas/PaginaCita.jsx
git mv src/pages/ErrorPages.jsx src/paginas/PaginaError.jsx
```

- [ ] **Step 5: Renombrar componentes del panel**

```bash
git mv src/components/ProtectedRoute/ProtectedRoute.jsx src/componentes/RutaProtegida/RutaProtegida.jsx
git mv src/components/InactivityWarning/InactivityWarningModal.jsx src/componentes/AvisoInactividad/AvisoInactividad.jsx
```

- [ ] **Step 6: Actualizar TODOS los imports**

Este es el paso critico. Usar grep para encontrar todos los imports que referencian los archivos viejos y actualizarlos.

Patron de busqueda y reemplazo para cada archivo renombrado:

```
contexts/AuthContext       → contextos/ContextoAutenticacion
hooks/useInactivityMonitor → hooks/useMonitorInactividad

layout/DashboardLayout/DashboardMain    → disposicion/PanelDisposicion/PanelPrincipal
layout/DashboardLayout/DashboardHeader  → disposicion/PanelDisposicion/PanelCabecera
layout/DashboardLayout/DashboardSidebar → disposicion/PanelDisposicion/PanelBarraLateral
layout/Main                             → disposicion/Principal
layout/Header/Header                    → disposicion/Cabecera/Cabecera
layout/Footer/Footer                    → disposicion/PiePagina/PiePagina

pages/DashboardPage           → paginas/PaginaPanel
pages/ClientesManagementPage  → paginas/PaginaClientes
pages/LoginPage               → paginas/PaginaInicioSesion
(... todos los demas paginas ...)

components/ProtectedRoute/ProtectedRoute       → componentes/RutaProtegida/RutaProtegida
components/InactivityWarning/InactivityWarningModal → componentes/AvisoInactividad/AvisoInactividad
```

Tambien actualizar los export names dentro de cada archivo:
- `AuthProvider` → `ProveedorAutenticacion`
- `useAuth` → `useAutenticacion`
- `AuthContext` → `ContextoAutenticacion`
- `DashboardMain` → `PanelPrincipal`
- `DashboardHeader` → `PanelCabecera`
- `DashboardSidebar` → `PanelBarraLateral`
- `ProtectedRoute` → `RutaProtegida`
- `useDashboard` → `usarPanel`
- `useInactivityMonitor` → `useMonitorInactividad`

- [ ] **Step 7: Actualizar alias de Vite si existe**

Verificar `vite.config.js` para aliases de path (`@/`). Si existe, actualizar para que `@/` apunte a `src/`.

- [ ] **Step 8: Verificar build y commit**

```bash
npx vite build
git add -A
git commit -m "refactor: renombrar archivos a castellano + actualizar todos los imports"
```

---

## FASE 2: Layout del Panel (paralelo, 2 agentes)

### Task 4: Redisenar PanelBarraLateral.jsx

**Files:**
- Modify: `src/disposicion/PanelDisposicion/PanelBarraLateral.jsx`

**Context:** Currently uses emoji icons, inline styles. Must become Tailwind-only with Phosphor Icons duotone.

- [ ] **Step 1: Reescribir completamente PanelBarraLateral.jsx**

El componente debe:
- Importar Phosphor Icons: `ChartBar, Users, Car, Wrench, Receipt, UserGear, GearSix, SignOut, Package, CalendarDots, ChartLine, Images, Newspaper, Star, Question, Tag, Sliders` de `@phosphor-icons/react`
- Usar `useAutenticacion` de `../../contextos/ContextoAutenticacion`
- Usar `usarPanel` del contexto local
- Usar `useLocation` y `useNavigate` de `react-router-dom`
- Usar `CARACTERISTICAS` de `../../configuracion/caracteristicas`

Estructura de items del menu (array con seccion, icono, ruta, rol requerido):

```js
const elementosMenu = [
  { seccion: 'Principal' },
  { etiqueta: 'Panel', icono: ChartBar, ruta: '/panel', roles: ['admin', 'empleado'] },

  { seccion: 'Taller' },
  { etiqueta: 'Clientes', icono: Users, ruta: '/panel/clientes', roles: ['admin', 'empleado'] },
  { etiqueta: 'Vehiculos', icono: Car, ruta: '/panel/vehiculos', roles: ['admin', 'empleado'] },
  { etiqueta: 'Servicios', icono: Wrench, ruta: '/panel/servicios', roles: ['admin', 'empleado'] },
  { etiqueta: 'Facturas', icono: Receipt, ruta: '/panel/facturas', roles: ['admin', 'empleado'] },

  { seccion: 'Taller Avanzado', requiere: 'INVENTARIO_ACTIVO' },
  { etiqueta: 'Repuestos', icono: Package, ruta: '/panel/repuestos', roles: ['admin'], requiere: 'INVENTARIO_ACTIVO' },
  { etiqueta: 'Citas', icono: CalendarDots, ruta: '/panel/citas', roles: ['admin', 'empleado'], requiere: 'CITAS_ONLINE' },
  { etiqueta: 'Reportes', icono: ChartLine, ruta: '/panel/reportes', roles: ['admin'], requiere: 'REPORTES_ACTIVOS' },

  { seccion: 'Contenido Web' },
  { etiqueta: 'Diapositivas', icono: Images, ruta: '/panel/admin/diapositivas', roles: ['admin'] },
  { etiqueta: 'Servicios Web', icono: Wrench, ruta: '/panel/admin/servicios', roles: ['admin'] },
  { etiqueta: 'Blog', icono: Newspaper, ruta: '/panel/admin/blog', roles: ['admin'] },
  { etiqueta: 'Equipo', icono: Users, ruta: '/panel/admin/equipo', roles: ['admin'] },
  { etiqueta: 'Galeria', icono: Images, ruta: '/panel/admin/galeria', roles: ['admin'] },
  { etiqueta: 'Testimonios', icono: Star, ruta: '/panel/admin/testimonios', roles: ['admin'] },
  { etiqueta: 'Preguntas', icono: Question, ruta: '/panel/admin/preguntas', roles: ['admin'] },
  { etiqueta: 'Precios', icono: Tag, ruta: '/panel/admin/precios', roles: ['admin'] },
  { etiqueta: 'Configuracion', icono: Sliders, ruta: '/panel/admin/configuracion', roles: ['admin'] },

  { seccion: 'Sistema' },
  { etiqueta: 'Usuarios', icono: UserGear, ruta: '/panel/usuarios', roles: ['admin'] },
];
```

Estilos: TODO en Tailwind. Sidebar fondo `bg-[var(--fondo)]`, borde derecho `border-r border-[var(--borde)]`, items hover `hover:bg-[var(--fondo-elevado)]`, item activo `border-l-[3px] border-[var(--acento)] bg-[var(--fondo-tarjeta)]`.

El sidebar colapsado muestra solo iconos (24px) sin texto. Expandido muestra icono + etiqueta.

Filtrar items por: rol del usuario (`useAutenticacion().user.rol`) y feature toggle (`CARACTERISTICAS[item.requiere]`).

- [ ] **Step 2: Verificar build**

```bash
npx vite build
```

- [ ] **Step 3: Commit**

```bash
git add src/disposicion/PanelDisposicion/PanelBarraLateral.jsx
git commit -m "feat: redisenar sidebar con Phosphor Icons, Tailwind, items por rol y toggles"
```

---

### Task 5: Redisenar PanelCabecera.jsx

**Files:**
- Modify: `src/disposicion/PanelDisposicion/PanelCabecera.jsx`

- [ ] **Step 1: Reescribir completamente PanelCabecera.jsx**

Imports necesarios:
- `List, Bell, SignOut, UserCircle, GearSix` de `@phosphor-icons/react`
- `useAutenticacion` de `../../contextos/ContextoAutenticacion`
- `usarPanel` del PanelPrincipal
- `useLocation, useNavigate` de `react-router-dom`
- shadcn/ui: `DropdownMenu*`, `Avatar*`, `Button` de `../../components/ui/`
- `useMonitorInactividad` info (optional: show session timer)

Funcionalidad:
- Boton toggle sidebar: `<List size={24} />` con `usarPanel().alternarBarraLateral`
- Titulo dinamico basado en la ruta (map de pathname a titulo en castellano)
- Breadcrumbs con shadcn/ui `Breadcrumb` generados desde la ruta
- Menu de usuario (derecha) con shadcn/ui `DropdownMenu`:
  - Avatar con inicial del nombre
  - Nombre + rol
  - Opciones: Mi Perfil, Configuracion, Cerrar Sesion
  - Cerrar Sesion llama `cerrarSesion()` de `useAutenticacion` y navega a `/inicio-sesion`

Todo en Tailwind. Fondo `bg-[var(--fondo)]`, borde inferior, backdrop-blur.

- [ ] **Step 2: Verificar build y commit**

```bash
npx vite build
git add src/disposicion/PanelDisposicion/PanelCabecera.jsx
git commit -m "feat: redisenar header con Phosphor Icons, DropdownMenu, Breadcrumb, titulo dinamico"
```

---

## FASE 3: Paginas CRUD del Taller (paralelo, lotes de 2-3)

### Task 6: Redisenar PaginaPanel.jsx (Dashboard Principal)

**Files:**
- Modify: `src/paginas/PaginaPanel.jsx`

- [ ] **Step 1: Reescribir PaginaPanel.jsx**

Eliminar: TODOS los inline SVGs (objeto `Icons`), inline styles, import de SCSS.

Agregar imports:
- Phosphor: `Users, Car, Clock, CheckCircle, CurrencyEur, Plus, Wrench, GearSix` con peso `duotone`
- shadcn: `Card, CardHeader, CardTitle, CardContent` de `@/components/ui/card`
- shadcn: `Table, TableHeader, TableBody, TableRow, TableHead, TableCell`
- shadcn: `Badge`, `Button`
- Recharts: `BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer`
- Servicios: importar `servicioClientes`, `servicioServicios`, etc.
- date-fns: `format` con locale `es`

5 stat cards con shadcn Card + Phosphor duotone 32px:
```jsx
<Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
  <CardContent className="flex items-center gap-4 p-6">
    <div className="rounded-lg bg-[var(--acento)]/10 p-3">
      <Users size={32} weight="duotone" className="text-[var(--acento)]" />
    </div>
    <div>
      <p className="text-sm text-[var(--texto-secundario)]">Total Clientes</p>
      <p className="text-2xl font-bold font-[family-name:var(--fuente-datos)] text-[var(--texto-principal)]">{estadisticas.totalClientes}</p>
    </div>
  </CardContent>
</Card>
```

Grafico con Recharts (reemplazar SimpleChart):
```jsx
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={datosGrafico}>
    <CartesianGrid strokeDasharray="3 3" stroke="var(--borde)" />
    <XAxis dataKey="mes" stroke="var(--texto-secundario)" />
    <YAxis stroke="var(--texto-secundario)" />
    <Tooltip contentStyle={{ background: 'var(--fondo-tarjeta)', border: '1px solid var(--borde)' }} />
    <Bar dataKey="servicios" fill="var(--acento)" radius={[4, 4, 0, 0]} />
  </BarChart>
</ResponsiveContainer>
```

Tabla de servicios recientes con shadcn Table. Timeline con Tailwind classes. Acciones rapidas con shadcn Button.

Todos los datos deben venir de los servicios (servicioClientes.contarTodos(), servicioServicios.obtenerTodos(), etc.).

- [ ] **Step 2: Verificar build y commit**

---

### Task 7: PaginaClientes + PaginaNuevoCliente + PaginaDetalleCliente

**Pattern:** Este task establece el PATRON CRUD que Tasks 8-11 replican.

**Files:**
- Modify: `src/paginas/PaginaClientes.jsx`
- Modify: `src/paginas/PaginaNuevoCliente.jsx`
- Modify: `src/paginas/PaginaDetalleCliente.jsx`

PaginaClientes.jsx:
- Import `servicioClientes` de `../servicios/servicioClientes`
- useEffect carga datos via `servicioClientes.obtenerTodos()`
- Barra de busqueda: shadcn `Input` + Phosphor `MagnifyingGlass`
- Vista tabla: shadcn `Table` con columnas (Nombre, Email, Telefono, Vehiculos, Acciones)
- Badge para estado (activo/inactivo)
- DropdownMenu per-row: Ver, Editar, Eliminar
- AlertDialog para confirmar eliminacion (llama `servicioClientes.eliminar(id)`)
- Pagination con shadcn `Pagination`
- Boton "Nuevo Cliente" con Phosphor `Plus` bold

PaginaNuevoCliente.jsx:
- Formulario con react-hook-form
- Campos: nombre, apellidos, email, telefono, direccion, notas
- Al guardar: `servicioClientes.crear(datos)` o `servicioClientes.actualizar(id, datos)` si edicion
- Redireccion a lista despues de guardar

PaginaDetalleCliente.jsx:
- Carga via `servicioClientes.obtenerPorId(id)`
- Card con datos del cliente
- Lista de vehiculos vinculados (via `servicioVehiculos.obtenerTodos({ clienteId })`)
- Historial de servicios

Todo en Tailwind + shadcn. Cero inline styles.

---

### Tasks 8-11: Vehiculos, Servicios, Facturas, Usuarios

**Patron:** Exactamente igual que Task 7 pero para cada entidad. Cada uno importa su servicio correspondiente y adapta los campos de tabla/formulario.

Task 8 - PaginaVehiculos: campos (marca, modelo, anio, matricula, cliente vinculado, estado)
Task 9 - PaginaServicios: campos (tipo, descripcion, vehiculo, tecnico, estado, costo) + badges de estado (pendiente/en_proceso/completado)
Task 10 - PaginaFacturas: campos (numero, cliente, servicios, total, estado pago) + boton generar PDF
Task 11 - PaginaUsuarios: campos (nombre, email, rol, activo) + eliminar styled-components

### Task 12: PaginaInicioSesion.jsx

Formulario centrado con shadcn Card + Input + Button. Dark theme consistente. Logo LoyolaMotors.

---

## FASE 4: Paginas nuevas del taller (paralelo, 3 agentes)

### Tasks 13-15: Repuestos, Citas, Reportes

Cada pagina es toggle-gated:
```jsx
if (!CARACTERISTICAS.INVENTARIO_ACTIVO) {
  return <ProximamenteCard titulo="Repuestos e Inventario" />;
}
```

Pero la logica CRUD completa debe estar implementada. Solo la UI se oculta con el toggle. Cuando se active el toggle, la pagina funciona sin cambios de codigo.

---

## FASE 5: CMS - Paginas admin de contenido (paralelo)

### Tasks 16-19: Paginas de administracion de contenido

Cada pagina admin sigue este patron:
- Import `servicioContenido` con la coleccion correspondiente
- shadcn Table para listar items
- Formulario modal/inline para crear/editar
- Confirmacion para eliminar
- Drag-and-drop para reordenar (o botones arriba/abajo)
- Preview del contenido como apareceria en el sitio publico

Task 16: Diapositivas (hero slides) + Precios + Configuracion del negocio
Task 17: Servicios web + Blog (con editor de contenido)
Task 18: Equipo + Galeria + Testimonios
Task 19: FAQ + migracion de datos hardcoded de JSON files a servicioContenido

---

## FASE 6: Migracion componentes publicos (paralelo)

### Tasks 20-23: Hacer componentes publicos dinamicos

Cada componente publico que lee datos hardcoded o de JSON se migra a consumir `servicioContenido` o `servicioConfiguracion`.

Patron de migracion:
```jsx
// ANTES
import slides from '../dataJson/slidesData.json';

// DESPUES
import { servicioContenido } from '../servicios/servicioContenido';
const [diapositivas, setDiapositivas] = useState([]);
useEffect(() => {
  servicioContenido.obtener('diapositivas', { orden: true }).then(setDiapositivas);
}, []);
```

Si el servicio retorna array vacio (no hay datos en localStorage), el componente debe mostrar datos por defecto (los mismos que estaban hardcoded). Esto garantiza que el sitio se ve igual sin necesidad de poblar la BD.

Task 20: HeroSlider, ServiceProgres, ChooseUs, AutoCounter
Task 21: Testimonial, CompanyTab, PricingTable, TrustedClient
Task 22: Blog sections, Team sections, Gallery, FAQ Accordion
Task 23: ContactInfo, Cta, FrequentlyQuestions, Footer → servicioConfiguracion

---

## FASE 7: Integracion y Rutas

### Task 24: Actualizar App.jsx con rutas castellano

**Files:**
- Modify: `src/App.jsx`

Cambiar todas las rutas:
```
/login          → /inicio-sesion
/dashboard      → /panel
/dashboard/*    → /panel/*
```

Agregar rutas nuevas:
```
/panel/repuestos
/panel/citas
/panel/reportes
/panel/admin/diapositivas
/panel/admin/servicios
/panel/admin/blog
/panel/admin/equipo
/panel/admin/galeria
/panel/admin/testimonios
/panel/admin/preguntas
/panel/admin/precios
/panel/admin/configuracion
```

Todas las rutas del panel nested bajo PanelPrincipal como layout route.

### Task 25: Renombrar AvisoInactividad + ContextoAutenticacion internals

Renombrar funciones internas a castellano (ya renombrados los archivos en Task 3):
- `logout` → `cerrarSesion`
- `login` → `iniciarSesion`
- `isAuthenticated` → `estaAutenticado`
- `hasRole` → `tieneRol`
- Actualizar todos los consumidores

---

## FASE 8: Documentacion + Testing

### Task 26: ADRs

Crear 6 ADR documents en `docs/adr/`:
- ADR-001-phosphor-icons.md
- ADR-002-eliminacion-styled-components.md
- ADR-003-paleta-automotive-industrial.md
- ADR-004-convencion-castellano.md
- ADR-005-recharts-graficos.md
- ADR-006-proteccion-sesion-inactividad.md

Formato: Titulo, Contexto, Decision, Consecuencias.

### Task 27: Suite E2E Playwright

Instalar Playwright y crear tests:
```bash
npm init playwright@latest
```

Tests a crear:
- `tests/navegacion.spec.js` - Sidebar links, breadcrumbs, rutas
- `tests/autenticacion.spec.js` - Login, logout, refresh, inactividad
- `tests/crud-clientes.spec.js` - Crear, leer, actualizar, eliminar cliente
- `tests/crud-vehiculos.spec.js`
- `tests/crud-servicios.spec.js`
- `tests/cms-contenido.spec.js` - Editar contenido, verificar en sitio publico
- `tests/sitio-publico.spec.js` - Paginas publicas cargan, contenido dinamico

### Task 28: Code review final

Invocar `/requesting-code-review` para revision completa del branch.
