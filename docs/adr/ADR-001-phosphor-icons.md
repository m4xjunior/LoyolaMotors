# ADR-001: Adopcion de Phosphor Icons

**Estado:** Aceptada
**Fecha:** 2026-03-28

## Contexto

El proyecto utilizaba emojis e SVGs en linea para los iconos del panel de control. Esta solucion era poco profesional, dificil de mantener y no ofrecia consistencia visual. Era necesario adoptar una biblioteca de iconos dedicada que se alineara con el lenguaje visual del proyecto.

## Decision

Se adopto Phosphor Icons (`@phosphor-icons/react`) como biblioteca de iconos principal del proyecto, con la siguiente convencion de pesos:

- **Duotone**: iconos de navegacion (sidebar, menus principales)
- **Regular**: acciones secundarias y elementos de interfaz generales
- **Bold**: llamadas a la accion (CTAs) y elementos de enfasis

Lucide Icons se mantiene exclusivamente para los componentes internos de shadcn/ui, respetando la convencion del proyecto upstream.

### Por que Phosphor sobre Lucide

| Criterio | Phosphor | Lucide |
|---|---|---|
| Variantes de peso | 6 (thin/light/regular/bold/fill/duotone) | 1 (stroke) |
| Tamano del set | +9.000 iconos | ~1.500 iconos |
| Lenguaje de diseno | Consistente y versatil | Minimalista uniforme |
| Soporte duotone | Si | No |

La variante duotone de Phosphor permite crear jerarquia visual sin necesidad de colores adicionales, lo cual es especialmente util en temas oscuros como el Automotive Industrial Dark.

## Consecuencias

### Positivas

- Iconografia profesional y consistente en todo el panel de control
- 6 variantes de peso permiten jerarquia visual clara
- Set de iconos amplio que cubre todas las necesidades actuales y futuras del proyecto
- Soporte nativo para temas oscuros mediante CSS variables
- Eliminacion de SVGs en linea reduce el tamano del bundle y mejora la legibilidad del codigo

### Negativas

- Dependencia adicional en el bundle (`@phosphor-icons/react`)
- Los desarrolladores deben aprender la convencion de pesos establecida
- Coexistencia de dos bibliotecas de iconos (Phosphor + Lucide para shadcn/ui) puede generar confusion inicial
