# Rediseno Completo del Panel de Administracion - LoyolaMotors

## Resumen

Rediseno total del panel de administracion de LoyolaMotors. Eliminar toda deuda tecnica visual (emojis, inline SVGs, styled-components, inline styles) y reemplazar con un sistema de diseno profesional nivel senior usando shadcn/ui + Tailwind CSS + Phosphor Icons.

Estetica: **Automotive Industrial Dark** - panel de control tecnico para taller mecanico.

## Convenciones Obligatorias

- **Idioma del codigo:** Castellano (espanol) - nombres de archivos, componentes, variables, rutas
- **Styling:** Solo Tailwind CSS + shadcn/ui. Cero inline styles. Cero styled-components.
- **Iconos:** Solo Phosphor Icons (`@phosphor-icons/react`). Cero emojis. Cero inline SVGs.
- **Componentes:** shadcn/ui como base. Componentes custom extienden shadcn.

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

```
src/
  contextos/
    ContextoAutenticacion.jsx      (renombrar de contexts/AuthContext.jsx)
  hooks/
    useMonitorInactividad.js       (renombrar de useInactivityMonitor.js)
  disposicion/                     (renombrar de layout/)
    Principal.jsx
    Cabecera/Cabecera.jsx
    PiePagina/PiePagina.jsx
    PanelDisposicion/
      PanelPrincipal.jsx           (renombrar de DashboardMain.jsx)
      PanelCabecera.jsx            (renombrar de DashboardHeader.jsx)
      PanelBarraLateral.jsx        (renombrar de DashboardSidebar.jsx)
  paginas/
    PaginaInicio.jsx
    PaginaPanel.jsx                (renombrar de DashboardPage.jsx)
    PaginaClientes.jsx             (renombrar de ClientesManagementPage.jsx)
    PaginaNuevoCliente.jsx
    PaginaDetalleCliente.jsx
    PaginaVehiculos.jsx
    PaginaNuevoVehiculo.jsx
    PaginaServiciosVehiculo.jsx
    PaginaServicios.jsx
    PaginaNuevoServicio.jsx
    PaginaFacturas.jsx             (renombrar de InvoicesPage.jsx)
    PaginaUsuarios.jsx
    PaginaInicioSesion.jsx         (renombrar de LoginPage.jsx)
  componentes/
    ui/                            (shadcn/ui - mantener en ingles per convention)
    RutaProtegida/RutaProtegida.jsx
    AvisoInactividad/AvisoInactividad.jsx
    NavAdmin/NavAdmin.jsx
    Navegacion/MenuNavegacion.jsx
```

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

Los specs se dividen en tareas independientes para `/dispatching-parallel-agents`:

**Grupo 1 (Infraestructura - secuencial):**
- T1: Instalar dependencias + actualizar tokens en globals.css
- T2: Renombrar archivos a castellano + actualizar imports

**Grupo 2 (Componentes de Layout - paralelo):**
- T3: Redisenar PanelBarraLateral.jsx (sidebar)
- T4: Redisenar PanelCabecera.jsx (header)

**Grupo 3 (Paginas - paralelo):**
- T5: Redisenar PaginaPanel.jsx (dashboard principal)
- T6: Redisenar PaginaClientes.jsx + PaginaNuevoCliente.jsx + PaginaDetalleCliente.jsx
- T7: Redisenar PaginaVehiculos.jsx + PaginaNuevoVehiculo.jsx
- T8: Redisenar PaginaServicios.jsx + PaginaNuevoServicio.jsx + PaginaServiciosVehiculo.jsx
- T9: Redisenar PaginaFacturas.jsx
- T10: Redisenar PaginaUsuarios.jsx (eliminar styled-components)
- T11: Redisenar PaginaInicioSesion.jsx

**Grupo 4 (Integracion):**
- T12: Actualizar App.jsx con rutas en castellano
- T13: Actualizar AvisoInactividad.jsx (modal de inactividad)

**Grupo 5 (Documentacion + Testing):**
- T14: Generar ADRs (Architecture Decision Records)
- T15: E2E tests con Playwright para todas las paginas y navegaciones

## 7. ADRs a Generar

- ADR-001: Eleccion de Phosphor Icons sobre Lucide/Heroicons
- ADR-002: Eliminacion de styled-components a favor de Tailwind
- ADR-003: Paleta automotive industrial dark
- ADR-004: Convencion de nombres en castellano
- ADR-005: Recharts como libreria de graficos
- ADR-006: Sistema de proteccion de sesion por inactividad

## 8. Criterios de Aceptacion

- [ ] Cero emojis en codigo del panel
- [ ] Cero inline SVGs
- [ ] Cero inline styles en componentes del panel
- [ ] Cero styled-components
- [ ] Todos los archivos del panel nombrados en castellano
- [ ] Phosphor Icons en toda la navegacion y acciones
- [ ] shadcn/ui `Table` en todas las vistas de datos
- [ ] shadcn/ui `Card` en todas las tarjetas
- [ ] shadcn/ui `Button`, `Input`, `Select`, `Badge` en formularios
- [ ] Tailwind como unico sistema de estilos del panel
- [ ] Build pasa sin errores
- [ ] Todas las rutas del dashboard funcionan
- [ ] Sesion persiste en refresh
- [ ] Logout solo por boton o inactividad
- [ ] E2E tests pasan para todas las paginas
