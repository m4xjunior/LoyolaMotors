# Mapa Estructural - Pagina de Inicio de Sesion

> Documento de referencia para futuras mejoras en la pagina de login.
> Cada archivo, componente, linea y dependencia mapeada.

---

## Inventario de Archivos

| Archivo | Proposito | Lineas | Rol |
|---------|-----------|--------|-----|
| `src/paginas/PaginaInicioSesion.jsx` | Pagina de login | 1-396 | UI principal |
| `src/contextos/ContextoAutenticacion.jsx` | Estado de autenticacion | 1-226 | Logica de auth + mock users |
| `src/components/Orb/Orb.jsx` | Fondo animado WebGL | 1-415 | Efecto visual de fondo |
| `src/components/Orb/Orb.css` | Estilos del Orb | 1-6 | Contenedor del canvas |
| `src/App.jsx` | Enrutamiento | 62-64 | Define rutas `/inicio-sesion` y `/login` |
| `src/componentes/RutaProtegida/RutaProtegida.jsx` | Guardia de rutas | 1-34 | Redirige a login si no autenticado |
| `src/disposicion/PanelDisposicion/PanelPrincipal.jsx` | Layout del panel | 22-26 | Redirige a login si no hay usuario |
| `src/disposicion/PanelDisposicion/PanelCabecera.jsx` | Header del panel | 50-54 | Boton cerrar sesion → login |
| `src/components/Nav/NavMenu.jsx` | Navegacion publica | 55-80 | Link "Login" cuando no autenticado |
| `src/main.jsx` | Bootstrap de la app | 1-21 | Provee ProveedorAutenticacion |

---

## 1. PaginaInicioSesion.jsx (396 lineas)

### Imports (Lineas 1-4)
```
L1:  useState (React)
L2:  useNavigate, useLocation (react-router-dom)
L3:  useAutenticacion (../contextos/ContextoAutenticacion)
L4:  Orb (../components/Orb/Orb)
```

### Estado Local (Lineas 7-14)
```
L7:   email = 'admin@loyolamotors.com'  (pre-rellenado)
L8:   password = 'admin123'             (pre-rellenado)
L9:   isLoading = false
L10:  error = ''
L11:  showPassword = false
L14:  { iniciarSesion } = useAutenticacion()
L16:  from = location.state?.from?.pathname || "/panel"
```

### Logica de Envio (Lineas 18-30)
```
L18-30: handleSubmit()
  → setIsLoading(true)
  → iniciarSesion(email, password)
  → Exito: navigate(from, { replace: true })
  → Error: setError(err.message)
  → Finally: setIsLoading(false)
```

### Estructura Visual

#### Contenedor Exterior (L33-42)
- `minHeight: 100vh`, centrado flex
- `background: #0a0a0a`
- `position: relative`, `overflow: hidden`

#### Componente Orb (L44-63)
- Wrapper absoluto: 1100x1100px
- Posicion: `top 50%, left 50%, translate(-50%, -40%)`
- `z-index: 0`, `opacity: 0.45`
- Props del Orb: `hue=200, hoverIntensity=1.8, forceHoverState=true`

#### Card Principal (L65-362)
- Clase CSS: `login-double-card`
- Grid: 2 columnas (`1.1fr 1fr`)
- Glassmorphism: `rgba(18,18,18,0.75) + blur(40px) saturate(1.4)`
- Borde: `1px solid rgba(255,255,255,0.08)`
- Radio: `20px`
- Sombra: `0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)`

#### Panel Izquierdo - Branding (L80-149)
- Clase: `login-left-panel`
- Min-height: 520px (280px en mobile)
- Fondo gradient: `linear-gradient(160deg, #1a0a08 → #2a0e0a → #1c1210 → #0d0a09)`
- Resplandor radial: `rgba(255,61,36,0.18)` en la base
- Linea superior decorativa: `rgba(255,61,36,0.3)`
- **Logo** (L119): `/assets/img/icon/loyola-logo-v2.png`, height 72px
- **Titulo** (L130-138): "Panel de administracion", 26px, weight 600
- **Descripcion** (L139-147): "Gestiona facturas...", 14px, rgba(255,255,255,0.45)

#### Panel Derecho - Formulario (L152-361)
- Clase: `login-right-panel`
- Padding: 32px 36px (24px en mobile)
- Max-width contenido: 360px

##### Header del Form (L159-177)
- **H1** (L161-168): "Iniciar sesion", 24px, weight 700
- **Subtitulo** (L170-176): "Ingresa tus credenciales", 14px

##### Campo Email (L180-222)
- Label: "CORREO ELECTRONICO" (uppercase, 12px)
- Input: type=email, height 46px, border-radius 10px
- Background: `rgba(255,255,255,0.05)`
- Focus: border → `rgba(255,61,36,0.5)`, bg → `rgba(255,255,255,0.08)`

##### Campo Password (L224-288)
- Label: "CONTRASENA" (uppercase, 12px)
- Input: type=password/text, padding-right 42px
- Boton toggle (L267-286): ◉/◡ caracteres, position absolute right

##### Mensaje de Error (L290-302)
- Condicional: solo si `error` tiene valor
- Background: `rgba(255,61,36,0.1)`, border: `rgba(255,61,36,0.25)`
- Color texto: `#ff6b4a`

##### Boton Submit (L304-347)
- Clase: `login-submit-btn`
- Height: 46px, border-radius: 10px
- Normal: `background: #ff3d24`, sombra naranja
- Hover: `#e8341e`, sombra mayor, translateY(-1px)
- Loading: `rgba(255,255,255,0.1)`, cursor not-allowed
- Spinner: 16x16px, border animation `spin 0.6s linear infinite`
- Texto normal: "Iniciar sesion →"
- Texto loading: "Iniciando sesion..."

##### Footer (L350-359)
- "Acceso exclusivo para personal autorizado"
- Font: 11px, color `rgba(255,255,255,0.25)`

### CSS Embebido (L364-393)
```css
@keyframes spin { to { transform: rotate(360deg); } }
.login-double-card { grid-template-columns: 1.1fr 1fr; }
.login-submit-btn:not(:disabled):hover { background: #e8341e; shadow mayor; translateY(-1px); }
.login-submit-btn:not(:disabled):active { translateY(0); }
input::placeholder { color: rgba(255,255,255,0.2); }
@media (max-width: 768px) { single column, reduced heights/padding }
```

---

## 2. Componente Orb (415 lineas)

### Props
| Prop | Default | En Login |
|------|---------|----------|
| hue | 0 | 200 (azul-cyan) |
| hoverIntensity | 0.2 | 1.8 (fuerte) |
| rotateOnHover | true | false |
| forceHoverState | false | true (siempre activo) |
| backgroundColor | #000000 | #0a0a0a |

### Dependencias
- Libreria `ogl` (WebGL rendering)
- React hooks: useEffect, useRef

### Shaders GLSL
- **Vertex shader** (L36-45): Triangulacion fullscreen
- **Fragment shader** (L51-234): Shader multi-funcion complejo
  - Perlin noise para movimiento organico
  - Rotacion de color (transformacion HSL via hue prop)
  - Modelos de iluminacion (doble capa)
  - Interaccion con mouse
  - Animacion de punto de luz orbital

### Loop de Animacion (L319-340)
- 60fps via requestAnimationFrame
- Transiciones suaves de hover (factor lerp 0.1)
- Actualizacion de uniforms del shader

---

## 3. ContextoAutenticacion.jsx - Funcion iniciarSesion

### Mock Users (L7-30)
```
Usuario 1: admin@lexusfx.com / Admin2025 (rol: admin)
Usuario 2: empleado@loyolamotors.com / empleado123 (rol: empleado)
```

### iniciarSesion(email, password) (L66-100)
```
→ Retorna Promise
→ Delay simulado: 500ms (setTimeout)
→ Busca en MOCK_USERS: email + password + activo
→ Exito:
  → Crea userSession {id, email, nombre, apellidos, rol}
  → setUser(userSession)
  → localStorage.setItem('isAuthenticated', 'true')
  → localStorage.setItem('currentUser', JSON.stringify)
  → Actualiza ultimoAcceso
  → resolve(userSession)
→ Error:
  → reject("Credenciales incorrectas o usuario inactivo")
```

### Persistencia de Sesion
```
localStorage keys:
  'isAuthenticated' → "true"
  'currentUser'     → JSON del objeto usuario
```

### Restauracion de Sesion (L38-49)
```
→ Al montar, lee localStorage
→ Si existe currentUser, restaura con JSON.parse (try/catch)
→ setLoading(false) al finalizar
```

### Sincronizacion Cross-Tab (L51-64)
```
→ Escucha evento 'storage' en window
→ Si isAuthenticated o currentUser eliminados → setUser(null)
→ Solo dispara en OTRAS pestanas (comportamiento nativo)
```

---

## 4. Flujo de Datos Completo

```
Usuario accede /inicio-sesion
    │
    ├─► App.jsx L62 → renderiza PaginaInicioSesion
    │
    ├─► Orb se renderiza como fondo animado WebGL
    │
    ├─► Usuario llena email + password
    │
    ├─► Submit → handleSubmit()
    │       │
    │       ├─► iniciarSesion(email, password)
    │       │       │
    │       │       ├─► Busca en MOCK_USERS
    │       │       ├─► localStorage.setItem('isAuthenticated')
    │       │       └─► resolve(userSession)
    │       │
    │       └─► navigate(from || '/panel')
    │
    ├─► RutaProtegida verifica estaAutenticado()
    │       │
    │       ├─► loading? → return null
    │       ├─► no auth? → redirect /inicio-sesion
    │       └─► auth ok? → renderiza children
    │
    └─► PanelPrincipal renderiza dashboard
            │
            ├─► useMonitorInactividad (15min timeout)
            │       └─► Al expirar → cerrarSesion() → /inicio-sesion
            │
            └─► PanelCabecera boton "Cerrar Sesion"
                    └─► cerrarSesion() → navigate('/inicio-sesion')
```

---

## 5. Paleta de Colores del Login

| Elemento | Color | Uso |
|----------|-------|-----|
| Fondo pagina | `#0a0a0a` | Background principal |
| Card glassmorphism | `rgba(18,18,18,0.75)` | Fondo del card |
| Gradient branding | `#1a0a08 → #2a0e0a → #1c1210 → #0d0a09` | Panel izquierdo |
| Resplandor | `rgba(255,61,36,0.18)` | Glow naranja inferior |
| Boton primario | `#ff3d24` | Submit |
| Boton hover | `#e8341e` | Submit hover |
| Error texto | `#ff6b4a` | Mensajes de error |
| Error fondo | `rgba(255,61,36,0.1)` | Background error |
| Texto principal | `#ffffff` | Titulos y inputs |
| Texto secundario | `rgba(255,255,255,0.45)` | Descripciones |
| Texto label | `rgba(255,255,255,0.5)` | Labels de inputs |
| Texto footer | `rgba(255,255,255,0.25)` | Texto minimo |
| Bordes | `rgba(255,255,255,0.08-0.1)` | Bordes sutiles |
| Focus border | `rgba(255,61,36,0.5)` | Input focus |
| Input bg | `rgba(255,255,255,0.05)` | Fondo de inputs |
| Input bg focus | `rgba(255,255,255,0.08)` | Fondo input activo |

---

## 6. Asset Visual

| Asset | Ruta | Dimensiones | Uso |
|-------|------|-------------|-----|
| Logo | `/assets/img/icon/loyola-logo-v2.png` | height 72px | Panel izquierdo branding |

---

## 7. Responsive

| Breakpoint | Cambios |
|------------|---------|
| > 768px | Grid 2 columnas (1.1fr + 1fr), left panel 520px min-height |
| ≤ 768px | Grid 1 columna, left panel 280px, padding reducido a 24px |
