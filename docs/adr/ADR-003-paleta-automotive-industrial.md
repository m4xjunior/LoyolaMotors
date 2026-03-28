# ADR-003: Paleta Automotive Industrial Dark

**Estado:** Aceptada
**Fecha:** 2026-03-28

## Contexto

El panel de control necesitaba un tema visual profesional que reflejara la identidad del negocio: un taller mecanico y concesionario automotriz. El tema anterior carecia de personalidad y no transmitia la solidez y profesionalismo que la marca Loyola Motors requiere. Se necesitaba una paleta cromatica y una tipografia que communicaran autoridad, precision tecnica y confianza.

## Decision

Se adopto la paleta **Automotive Industrial Dark** basada en las recomendaciones del plugin UI/UX Pro Max para el sector automotriz y concesionarios de vehiculos.

### Paleta de colores

| Token | Valor | Uso |
|---|---|---|
| `background` | `#0F172A` | Fondo principal (navy profundo) |
| `card` | `#1E293B` | Tarjetas y paneles (slate oscuro) |
| `accent` | `#DC2626` | Acento principal (rojo automotriz) |
| `border` | `#334155` | Bordes y separadores |
| `text-primary` | `#F8FAFC` | Texto principal |
| `text-muted` | `#94A3B8` | Texto secundario y etiquetas |

### Tipografia

| Fuente | Uso |
|---|---|
| **Inter** | Titulos y encabezados |
| **Fira Sans** | Cuerpo de texto y elementos de interfaz |
| **Fira Code** | Datos numericos, KPIs y valores tecnicos |

El uso de Fira Code para datos numericos refuerza la precision tecnica y facilita la lectura de cifras en tablas y dashboards.

## Consecuencias

### Positivas

- Identidad visual coherente con el sector automotriz e industrial
- El navy oscuro reduce la fatiga visual en sesiones de trabajo prolongadas
- El acento rojo (`#DC2626`) crea un contraste claro y reconocible para acciones importantes
- La tipografia diferenciada por contexto (encabezado / cuerpo / datos) mejora la legibilidad y jerarquia informativa
- Alineacion con las tendencias actuales de diseno para aplicaciones B2B del sector automotriz

### Negativas

- El tema oscuro puede requerir ajustes adicionales para garantizar accesibilidad (contraste WCAG AA/AAA) en todos los textos
- La paleta esta disenada exclusivamente para modo oscuro; un eventual modo claro requeriria definir tokens alternativos
- La fuente Fira Code en datos puede resultar inusual para usuarios no tecnicos, aunque no afecta la legibilidad
