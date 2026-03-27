# Rediseno Completo del Panel de Administracion - LoyolaMotors

## Resumen

Rediseno total del panel de administracion de LoyolaMotors. Eliminar toda deuda tecnica visual (emojis, inline SVGs, styled-components, inline styles) y reemplazar con un sistema de diseno profesional nivel senior usando shadcn/ui + Tailwind CSS + Phosphor Icons.

Estetica: **Automotive Industrial Dark** - panel de control tecnico para taller mecanico.

## Convenciones Obligatorias

- **Idioma del codigo:** Castellano (espanol) - nombres de archivos, componentes, variables, rutas
- **Styling:** Solo Tailwind CSS + shadcn/ui. Cero inline styles. Cero styled-components.
- **Iconos:** Solo Phosphor Icons (`@phosphor-icons/react`). Cero emojis. Cero inline SVGs.
- **Componentes:** shadcn/ui como base. Componentes custom extienden shadcn.
- **Archivos:** NO crear archivos nuevos. Renombrar y editar los existentes en su lugar. Git rename.
- **CRUD-ready:** Cada componente de datos debe tener logica CRUD completa con interfaces reales, no stubs.
- **Backend-ready:** Funciones y toggles preparados para ser consumidos por backend Rust/Tauri/Prisma/Postgres.
- **Minimo acoplamiento:** Cuando el backend llegue, no debe requerir tocar muchos archivos.

## Principios de Arquitectura (Tauri-Ready)

### Capa de Servicios

Cada entidad del taller (clientes, vehiculos, servicios, facturas, usuarios) tendra un archivo de servicio en `src/servicios/` con la interfaz CRUD completa:

```js
// src/servicios/servicioClientes.js
export const servicioClientes = {
  obtenerTodos:      async (filtros) => { /* retorna [] por ahora */ },
  obtenerPorId:      async (id) => { /* retorna null por ahora */ },
  crear:             async (datos) => { /* retorna el objeto creado */ },
  actualizar:        async (id, datos) => { /* retorna el objeto actualizado */ },
  eliminar:          async (id) => { /* retorna boolean */ },
  buscar:            async (termino) => { /* retorna [] */ },
};
```

Los componentes llaman SOLO a estos servicios, nunca acceden a datos directamente. Cuando el backend Tauri/Prisma este listo, solo se cambia la implementacion del servicio - los componentes no se tocan.

### Feature Toggles

```js
// src/configuracion/caracteristicas.js
export const CARACTERISTICAS = {
  BASE_DATOS_ACTIVA:       false,  // true cuando Prisma este conectado
  NOTIFICACIONES_ACTIVAS:  false,  // true cuando el sistema de notificaciones este listo
  REPORTES_ACTIVOS:        false,  // true cuando el modulo de reportes este implementado
  FACTURACION_ELECTRONICA: false,  // true cuando se integre con sistema fiscal
  CITAS_ONLINE:            false,  // true cuando el modulo de citas este listo
};
```

Los componentes verifican estos toggles para mostrar/ocultar funcionalidad:
```jsx
{CARACTERISTICAS.REPORTES_ACTIVOS && <BotonExportarReporte />}
```

### Funciones de un Taller Mecanico (CRUD completo en cada servicio)

Entidades del negocio que deben estar preparadas:

| Entidad | Operaciones | Estado Actual |
|---------|------------|---------------|
| Clientes | CRUD + busqueda + historial | Parcial (mock) |
| Vehiculos | CRUD + vincular a cliente + historial servicios | Parcial (mock) |
| Servicios/Ordenes de Trabajo | CRUD + estados + asignar tecnico + costos | Parcial (mock) |
| Facturas | CRUD + generar PDF + estados de pago | Parcial (mock) |
| Usuarios/Tecnicos | CRUD + roles + permisos | Parcial (mock) |
| Repuestos/Inventario | CRUD + stock + vincular a servicio | No existe - crear interfaz |
| Citas/Agenda | CRUD + calendario + disponibilidad | No existe - crear interfaz |
| Reportes | Generacion + filtros + exportacion | No existe - crear interfaz |

Cada servicio retorna datos vacios/default pero con la estructura completa que el backend llenara.

## 1. Sistema de Diseno

### 1.1 Paleta de Colores (Automotive Industrial)

Fuente: UI/UX Pro Max - Automotive/Car Dealership palette + Financial Dashboard dark mode

```
Tokens CSS (globals.css):
--fondo:              #0F172A   /* Deep navy - fondo principal */
--fondo-tarjeta:      #1E293B   /* Slate - tarjetas y superficies elevadas */
--fondo-elevado:      #334155   /* Slate claro - hover, inputs */
--texto-principal:    #F8FAFC   /* Blanco frio - headings */
--texto-secundario:   #94A3B8   /* Gris slate - body text */
--texto-deshabilitado:#64748B   /* Gris medio - disabled, placeholders */
--acento:             #DC2626   /* Rojo accion - CTAs, alertas, brand */
--acento-hover:       #B91C1C   /* Rojo oscuro - hover states */
--exito:              #22C55E   /* Verde - completado, activo */
--advertencia:        #F59E0B   /* Ambar - en proceso, atencion */
--peligro:            #EF4444   /* Rojo - error, eliminacion */
--info:               #3B82F6   /* Azul - informativo */
--borde:              #334155   /* Slate - bordes sutiles */
--borde-enfoque:      #DC2626   /* Rojo - focus ring */
```

### 1.2 Tipografia

Fuente: UI/UX Pro Max - Dashboard Data + Bold Typography patterns

```
Headings:    Inter (600-800 weight, letter-spacing: -0.025em)
Body:        Fira Sans (300-500 weight)
Datos/KPIs:  Fira Code (monospace, para numeros y metricas)

Escala:
--texto-xs:   0.75rem / 1rem
--texto-sm:   0.875rem / 1.25rem
--texto-base: 1rem / 1.5rem
--texto-lg:   1.125rem / 1.75rem
--texto-xl:   1.25rem / 1.75rem
--texto-2xl:  1.5rem / 2rem
--texto-3xl:  1.875rem / 2.25rem
--texto-4xl:  2.25rem / 2.5rem
```

### 1.3 Iconos - Phosphor Icons

Fuente: UI/UX Pro Max - Icon library strategy

Instalar: `@phosphor-icons/react`

Pesos a usar:
- **regular** (peso 1.5): Navegacion sidebar, acciones secundarias
- **bold** (peso 2): CTAs, acciones principales, estado activo en sidebar
- **duotone**: Tarjetas de estadisticas, iconos decorativos grandes

Mapa de iconos del sidebar:
```
Panel Principal  → ChartBar (duotone)
Clientes         → Users (duotone)
Vehiculos        → Car (duotone)
Servicios        → Wrench (duotone)
Facturas         → Receipt (duotone)
Usuarios         → UserGear (duotone)
Configuracion    → GearSix (duotone)
Cerrar Sesion    → SignOut (regular)
```

Mapa de iconos de acciones:
```
Crear/Nuevo      → Plus (bold)
Editar           → PencilSimple (regular)
Eliminar         → Trash (regular)
Buscar           → MagnifyingGlass (regular)
Filtrar          → Funnel (regular)
Exportar         → Export (regular)
Ver detalle      → Eye (regular)
Volver           → ArrowLeft (regular)
Menu hamburguesa → List (regular)
Notificaciones   → Bell (regular)
```

### 1.4 Espaciado y Radios

```
--radio-sm:  6px    /* inputs, badges */
--radio-md:  8px    /* botones, tarjetas pequenas */
--radio-lg:  12px   /* tarjetas principales */
--radio-xl:  16px   /* modales, contenedores */

Espaciado: sistema de 4px (Tailwind default)
Gap entre tarjetas: 24px (gap-6)
Padding de tarjetas: 24px (p-6)
Padding de pagina: 32px (p-8)
```

## 2. Estructura de Archivos (Castellano)

Regla: NO crear archivos nuevos para reemplazar existentes. Renombrar via `git mv` y editar.

```
src/
  configuracion/
    caracteristicas.js             (NUEVO - feature toggles)
  servicios/                       (NUEVO - capa de servicios CRUD)
    servicioClientes.js
    servicioVehiculos.js
    servicioServicios.js
    servicioFacturas.js
    servicioUsuarios.js
    servicioRepuestos.js           (inventario/stock)
    servicioCitas.js               (agenda/citas)
    servicioReportes.js            (reportes/exportacion)
  contextos/
    ContextoAutenticacion.jsx      (git mv de contexts/AuthContext.jsx)
  hooks/
    useMonitorInactividad.js       (git mv de hooks/useInactivityMonitor.js)
  disposicion/                     (git mv de layout/)
    Principal.jsx
    Cabecera/Cabecera.jsx
    PiePagina/PiePagina.jsx
    PanelDisposicion/
      PanelPrincipal.jsx           (git mv de DashboardMain.jsx)
      PanelCabecera.jsx            (git mv de DashboardHeader.jsx)
      PanelBarraLateral.jsx        (git mv de DashboardSidebar.jsx)
  paginas/
    PaginaInicio.jsx
    PaginaPanel.jsx                (git mv de DashboardPage.jsx)
    PaginaClientes.jsx             (git mv de ClientesManagementPage.jsx)
    PaginaNuevoCliente.jsx         (git mv de NovoClientePage.jsx)
    PaginaDetalleCliente.jsx       (git mv de ClienteDetailPage.jsx)
    PaginaVehiculos.jsx            (git mv de VehiclesPage.jsx / VehiclesManagementPage.jsx)
    PaginaNuevoVehiculo.jsx        (git mv de NovoVehiculoPage.jsx)
    PaginaServiciosVehiculo.jsx    (git mv de VehicleServicesPage.jsx)
    PaginaServicios.jsx            (git mv de ServicesPage.jsx)
    PaginaNuevoServicio.jsx        (git mv de NovoServicoPage.jsx)
    PaginaFacturas.jsx             (git mv de InvoicesPage.jsx)
    PaginaUsuarios.jsx             (git mv de UsersManagementPage.jsx)
    PaginaInicioSesion.jsx         (git mv de LoginPage.jsx)
    PaginaRepuestos.jsx            (NUEVO - inventario, toggle-gated)
    PaginaCitas.jsx                (NUEVO - agenda, toggle-gated)
    PaginaReportes.jsx             (NUEVO - reportes, toggle-gated)
  componentes/
    ui/                            (shadcn/ui - mantener en ingles per convention)
    RutaProtegida/RutaProtegida.jsx
    AvisoInactividad/AvisoInactividad.jsx
    NavAdmin/NavAdmin.jsx
    Navegacion/MenuNavegacion.jsx
```

NOTA: Las 3 paginas nuevas (Repuestos, Citas, Reportes) son las unicas excepciones a la regla "no crear archivos nuevos" porque son funcionalidad nueva del taller que no existia.

## 3. Componentes del Panel - Rediseno

### 3.1 PanelBarraLateral.jsx

**Estado actual:** Emojis como iconos, inline styles, sin estados hover/activo claros.

**Rediseno:**
- Phosphor Icons duotone (24px) para cada item de menu
- Items de menu con shadcn-style: hover con `bg-fondo-elevado`, activo con borde izquierdo `acento` 3px
- Logo de LoyolaMotors en la parte superior
- Seccion de usuario inferior con Avatar de shadcn/ui
- Colapso: solo iconos (sin texto) a 80px width
- Todo en Tailwind, cero inline styles
- Navegacion con items por rol (admin ve todos, empleado ve subset)

### 3.2 PanelCabecera.jsx

**Estado actual:** handleLogout vacio (ya arreglado), inline styles, avatar manual.

**Rediseno:**
- Layout flex con Tailwind
- Boton menu: Phosphor `List` icon
- Titulo de pagina dinamico basado en la ruta
- Breadcrumbs con componente shadcn/ui `Breadcrumb`
- Menu de usuario con shadcn/ui `DropdownMenu` + `Avatar`
- Indicador de tiempo de sesion restante (usando el hook de inactividad)

### 3.3 PaginaPanel.jsx (Dashboard Principal)

**Estado actual:** 140+ lineas de inline SVGs, iconos en objeto `Icons`, inline styles mezclados con SCSS.

**Rediseno:**
- Eliminar TODOS los inline SVGs - reemplazar con Phosphor Icons
- 5 tarjetas de estadisticas con shadcn/ui `Card` + Phosphor duotone icons
- Grafico de servicios con **Recharts** (compatible React 18, recomendado por plugin para dashboards)
- Tabla de servicios recientes con shadcn/ui `Table`
- Lista de clientes recientes con shadcn/ui `Card` + `Avatar`
- Timeline de actividades con diseno custom pero Tailwind only
- Metricas mini con `Card` compactas
- Acciones rapidas con `Button` variants de shadcn/ui
- Todo en Tailwind, cero inline styles, cero SCSS

### 3.4 PaginaClientes.jsx

**Rediseno:**
- Barra de busqueda con shadcn/ui `Input` + Phosphor `MagnifyingGlass`
- Filtros con shadcn/ui `Select`
- Vista tabla con shadcn/ui `Table` (responsive con overflow-x-auto)
- Vista tarjetas con shadcn/ui `Card`
- Toggle vista con Phosphor icons (`Table`/`GridFour`)
- Paginacion con shadcn/ui `Pagination`
- Badges de estado con shadcn/ui `Badge`
- Dialogo de eliminacion con shadcn/ui `AlertDialog`
- Acciones por fila con shadcn/ui `DropdownMenu`

### 3.5 PaginaVehiculos.jsx

Mismo patron que PaginaClientes pero adaptado a vehiculos.

### 3.6 PaginaServicios.jsx

Mismo patron con estados de servicio (pendiente, en_proceso, completado).

### 3.7 PaginaFacturas.jsx

Mismo patron con vista de facturas, totales, y estados de pago.

### 3.8 PaginaUsuarios.jsx (Solo Admin)

- Eliminar styled-components completamente
- Mismo patron de tabla + formulario
- Toggle activo/inactivo con estados claros

### 3.9 PaginaInicioSesion.jsx

- Form centrado con shadcn/ui `Card` + `Input` + `Button`
- Branding LoyolaMotors con logo
- Dark theme consistente con el panel

## 4. Dependencias a Agregar/Eliminar

### Agregar:
- `@phosphor-icons/react` - Sistema de iconos profesional
- `recharts` - Graficos para dashboard (recomendado por plugin)

### Eliminar:
- `styled-components` - Reemplazar por Tailwind
- Eliminar uso de emojis en todo el codigo
- Eliminar inline SVG definitions

### Mantener:
- `shadcn` + componentes `ui/`
- `tailwind-merge`, `clsx`, `class-variance-authority`
- `lucide-react` (solo para shadcn/ui internos)
- `date-fns` para formateo de fechas
- `react-hook-form` para formularios

## 5. Migracion de Estilos

### Estrategia:
1. Actualizar `globals.css` con los nuevos tokens de color
2. Eliminar `Dashboard.scss` - migrar todo a clases Tailwind
3. Eliminar styled-components de `PaginaUsuarios.jsx`
4. Eliminar inline styles de todos los componentes del panel
5. Mantener SCSS del sitio publico (fuera del dashboard) intacto

### Tailwind Config:
Extender el tema con los tokens custom en `globals.css` usando el sistema de CSS variables + Tailwind.

## 6. CMS - Sitio Publico Dinamico desde el Panel

### Principio
Todo contenido del sitio publico (imagenes, textos, videos, blogs, equipo, servicios, precios, testimonios, FAQ, galeria) debe ser editable desde el panel de administracion. Cero contenido hardcoded en componentes publicos.

### Capa de Servicios de Contenido

```
src/servicios/
  servicioContenido.js       (CRUD generico para todo contenido del sitio)
  servicioConfiguracion.js   (datos del negocio: telefono, email, direccion, horario, redes sociales)
```

`servicioContenido` maneja todas las entidades de contenido via un patron generico:

```js
export const servicioContenido = {
  // Cada seccion del sitio es una "coleccion"
  obtener:     async (coleccion, filtros) => { /* retorna items */ },
  obtenerUno:  async (coleccion, id) => { /* retorna item */ },
  guardar:     async (coleccion, id, datos) => { /* upsert */ },
  eliminar:    async (coleccion, id) => { /* borrar */ },
  reordenar:   async (coleccion, ids) => { /* cambiar orden */ },
};

// Colecciones: 'diapositivas', 'servicios', 'blog', 'equipo', 'galeria',
//              'testimonios', 'preguntas', 'precios', 'estadisticas',
//              'pestanasEmpresa', 'logosClientes', 'ofertasCta'
```

`servicioConfiguracion` centraliza datos del negocio (hoy dispersos en 4+ componentes):

```js
export const servicioConfiguracion = {
  obtener: async () => ({
    telefono: '+34 640 16 29 47',
    email: 'info@loyolamotors.es',
    direccion: 'C/ Sant Ignasi de Loiola, 21-BJ IZ, 46008 Valencia',
    horario: 'Lun - Vie: 9:00 - 18:00',
    redesSociales: { twitter: '', facebook: '', linkedin: '', instagram: '' },
    videoYoutube: 'VcaAVWtP48A',
  }),
  actualizar: async (datos) => { /* guardar config */ },
};
```

### Paginas de Administracion de Contenido (nuevas en el panel)

| Pagina Admin | Gestiona | Componentes Publicos Afectados |
|---|---|---|
| PaginaAdminDiapositivas.jsx | Hero slides (3) | HeroSlider.jsx |
| PaginaAdminServicios.jsx | Servicios (15) | Services*.jsx, SingleService.jsx |
| PaginaAdminBlog.jsx | Blog posts (4+) | Blog.jsx, SingleBlog.jsx, Blogs.jsx |
| PaginaAdminEquipo.jsx | Equipo (3+) | Team.jsx, TeamMemberDetails.jsx |
| PaginaAdminGaleria.jsx | Galeria (7+) | Gallery.jsx |
| PaginaAdminTestimonios.jsx | Testimonios (2+) | Testimonial.jsx |
| PaginaAdminPreguntas.jsx | FAQ (5+) | Accordion.jsx |
| PaginaAdminPrecios.jsx | Planes precios (3) | PricingTable.jsx |
| PaginaAdminConfiguracion.jsx | Config negocio | Cabecera, PiePagina, Contacto, CTA |

Cada pagina admin usa shadcn/ui Table + formularios con shadcn/ui Input/Select/Button.
Los JSON existentes (`blogsData.json`, `teamMembersData.json`, etc.) se migran a la capa de servicios.

### Migracion de Componentes Publicos

Los componentes publicos actuales leen datos de JSON imports o hardcoded. Deben migrar a consumir `servicioContenido`:

```jsx
// ANTES (hardcoded):
const slides = [{ title: "Taller de Chapa...", ... }];

// DESPUES (dinamico):
const [diapositivas, setDiapositivas] = useState([]);
useEffect(() => {
  servicioContenido.obtener('diapositivas').then(setDiapositivas);
}, []);
```

### Inventario de Contenido Hardcoded a Migrar

| Tipo | Cantidad | Fuente Actual | Prioridad |
|---|---|---|---|
| Servicios | 15 | JSON + componentes | ALTA |
| Blog posts | 4 | JSON | ALTA |
| Hero slides | 3 | HeroSlider.jsx hardcoded | ALTA |
| Precios | 3 | PricingTable.jsx hardcoded | ALTA |
| Config negocio | 1 | Disperso en 4+ componentes | ALTA |
| Equipo | 3 | JSON + Teams.jsx duplicado | MEDIA |
| Galeria | 7 | JSON | MEDIA |
| Testimonios | 2 | Testimonial.jsx hardcoded | MEDIA |
| FAQ | 5 | Accordion.jsx hardcoded | MEDIA |
| Estadisticas | 3 | AutoCounter.jsx hardcoded | BAJA |
| Tabs empresa | 3 | CompanyTab.jsx hardcoded | BAJA |
| Logos clientes | 7 | TrustedClient.jsx hardcoded | BAJA |
| Ofertas CTA | 1 | Cta.jsx hardcoded | BAJA |

## 7. Plan de Ejecucion con Agentes Paralelos

Metodologia: **TDD** - tests E2E con Playwright antes y despues de cada grupo. Validar que no se rompe nada existente antes de avanzar.

**FASE 1: Infraestructura (secuencial, bloqueante)**
- T1: Instalar deps (`@phosphor-icons/react`, `recharts`) + tokens globals.css + tipografia Inter/Fira
- T2: Crear capa de servicios CRUD (`src/servicios/` - 11 servicios) + feature toggles + servicioContenido + servicioConfiguracion
- T3: `git mv` renombrar archivos a castellano + actualizar TODOS los imports

**FASE 2: Layout del Panel (paralelo, 2 agentes)**
- T4: PanelBarraLateral.jsx - Phosphor duotone, items por rol, nuevas secciones (Repuestos, Citas, Reportes, CMS)
- T5: PanelCabecera.jsx - DropdownMenu, Breadcrumb, titulo dinamico por ruta

**FASE 3: Paginas CRUD del Taller (paralelo, lotes)**
- T6: PaginaPanel.jsx - dashboard con Phosphor + shadcn Cards + Recharts
- T7: PaginaClientes.jsx + NuevoCliente + DetalleCliente (CRUD servicioClientes)
- T8: PaginaVehiculos.jsx + NuevoVehiculo (CRUD servicioVehiculos)
- T9: PaginaServicios.jsx + NuevoServicio + ServiciosVehiculo (CRUD servicioServicios)
- T10: PaginaFacturas.jsx (CRUD servicioFacturas)
- T11: PaginaUsuarios.jsx (eliminar styled-components, CRUD servicioUsuarios)
- T12: PaginaInicioSesion.jsx (shadcn form, dark theme)

**FASE 4: Paginas nuevas del taller (paralelo)**
- T13: PaginaRepuestos.jsx (inventario/stock, toggle-gated)
- T14: PaginaCitas.jsx (agenda/calendario, toggle-gated)
- T15: PaginaReportes.jsx (reportes/exportacion, toggle-gated)

**FASE 5: CMS - Paginas admin de contenido (paralelo, lotes)**
- T16: PaginaAdminDiapositivas + PaginaAdminPrecios + PaginaAdminConfiguracion (CRUD servicioContenido)
- T17: PaginaAdminServicios + PaginaAdminBlog (CRUD servicioContenido)
- T18: PaginaAdminEquipo + PaginaAdminGaleria + PaginaAdminTestimonios (CRUD servicioContenido)
- T19: PaginaAdminPreguntas + migracion de datos hardcoded a servicioContenido

**FASE 6: Migracion componentes publicos (paralelo)**
- T20: HeroSlider + ServiceProgres + ChooseUs + AutoCounter → consumir servicioContenido
- T21: Testimonial + CompanyTab + PricingTable + TrustedClient → consumir servicioContenido
- T22: Blog/Blogs + Team/Teams + Gallery + FAQ → consumir servicioContenido
- T23: ContactInfo + Cta + FrequentlyQuestions + Footer → consumir servicioConfiguracion

**FASE 7: Integracion y Rutas**
- T24: App.jsx - rutas castellano + rutas CMS admin + rutas nuevas entidades
- T25: AvisoInactividad + ContextoAutenticacion (renombrar, mantener logica)

**FASE 8: Documentacion + Testing**
- T26: ADRs (6 documentos)
- T27: Suite E2E Playwright - navegacion, CRUD, auth, CMS, contenido dinamico
- T28: Code review final `/requesting-code-review`

## 7. ADRs a Generar

- ADR-001: Eleccion de Phosphor Icons sobre Lucide/Heroicons
- ADR-002: Eliminacion de styled-components a favor de Tailwind
- ADR-003: Paleta automotive industrial dark
- ADR-004: Convencion de nombres en castellano
- ADR-005: Recharts como libreria de graficos
- ADR-006: Sistema de proteccion de sesion por inactividad

## 8. Criterios de Aceptacion

### Calidad Visual
- [ ] Cero emojis en codigo del panel
- [ ] Cero inline SVGs
- [ ] Cero inline styles en componentes del panel
- [ ] Cero styled-components
- [ ] Phosphor Icons en toda la navegacion y acciones
- [ ] shadcn/ui `Table`, `Card`, `Button`, `Input`, `Select`, `Badge` usados consistentemente
- [ ] Tailwind como unico sistema de estilos del panel

### Convenciones
- [ ] Todos los archivos del panel nombrados en castellano
- [ ] Todos los imports actualizados tras renombramientos
- [ ] Variables y funciones en castellano

### Arquitectura CRUD-Ready
- [ ] Capa de servicios CRUD completa para las 8 entidades
- [ ] Feature toggles configurados para funcionalidad futura
- [ ] Componentes consumen solo servicios, nunca datos directamente
- [ ] Estructura preparada para backend Tauri/Prisma sin tocar componentes

### Funcionalidad
- [ ] Build pasa sin errores
- [ ] Todas las rutas del dashboard funcionan
- [ ] Sesion persiste en refresh
- [ ] Logout solo por boton o inactividad
- [ ] Navegacion sidebar refleja todas las entidades del taller
- [ ] Paginas toggle-gated (Repuestos, Citas, Reportes) ocultas pero funcionales

### Testing
- [ ] E2E tests Playwright para cada pagina del panel
- [ ] Tests de navegacion (sidebar, breadcrumbs, rutas)
- [ ] Tests de CRUD flow (crear, leer, actualizar, eliminar) por entidad
- [ ] Tests de autenticacion (login, logout, inactividad, refresh)
- [ ] Code review final aprobado
