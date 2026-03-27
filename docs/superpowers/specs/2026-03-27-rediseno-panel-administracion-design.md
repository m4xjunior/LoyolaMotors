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

## 6. Plan de Ejecucion con Agentes Paralelos

Metodologia: **TDD** - escribir tests E2E antes de implementar cada componente. Cada agente valida funciones con Playwright antes de commitear.

Los specs se dividen en tareas independientes para `/dispatching-parallel-agents`:

**Grupo 1 (Infraestructura - secuencial):**
- T1: Instalar dependencias (`@phosphor-icons/react`, `recharts`) + actualizar tokens en globals.css + tipografia
- T2: Crear capa de servicios CRUD (`src/servicios/`) + feature toggles (`src/configuracion/`)
- T3: `git mv` renombrar archivos a castellano + actualizar TODOS los imports en App.jsx y entre archivos

**Grupo 2 (Componentes de Layout - paralelo):**
- T4: Redisenar PanelBarraLateral.jsx (sidebar con Phosphor duotone, items por rol, nuevas entidades)
- T5: Redisenar PanelCabecera.jsx (header con DropdownMenu, Breadcrumb, titulo dinamico)

**Grupo 3 (Paginas existentes - paralelo, lotes de 3-4):**
- T6: PaginaPanel.jsx (dashboard principal - eliminar inline SVGs, usar Phosphor + shadcn Cards + Recharts)
- T7: PaginaClientes.jsx + PaginaNuevoCliente.jsx + PaginaDetalleCliente.jsx (CRUD completo via servicioClientes)
- T8: PaginaVehiculos.jsx + PaginaNuevoVehiculo.jsx (CRUD via servicioVehiculos)
- T9: PaginaServicios.jsx + PaginaNuevoServicio.jsx + PaginaServiciosVehiculo.jsx (CRUD via servicioServicios)
- T10: PaginaFacturas.jsx (CRUD via servicioFacturas)
- T11: PaginaUsuarios.jsx (eliminar styled-components, CRUD via servicioUsuarios)
- T12: PaginaInicioSesion.jsx (form con shadcn/ui, dark theme)

**Grupo 4 (Paginas nuevas del taller - paralelo):**
- T13: PaginaRepuestos.jsx (inventario/stock - toggle-gated, CRUD via servicioRepuestos)
- T14: PaginaCitas.jsx (agenda/calendario - toggle-gated, CRUD via servicioCitas)
- T15: PaginaReportes.jsx (reportes/exportacion - toggle-gated, CRUD via servicioReportes)

**Grupo 5 (Integracion):**
- T16: Actualizar App.jsx con rutas en castellano + nuevas rutas
- T17: Actualizar AvisoInactividad.jsx + ContextoAutenticacion.jsx (renombrar + mantener logica)

**Grupo 6 (Documentacion + Testing Final):**
- T18: Generar ADRs (Architecture Decision Records)
- T19: Suite E2E completa con Playwright - todas las paginas, navegaciones, CRUD flows, login/logout, inactividad
- T20: Code review final con `/requesting-code-review`

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
