# ADR-005: Adopcion de Recharts para graficos

**Estado:** Aceptada
**Fecha:** 2026-03-28

## Contexto

El panel de control utilizaba componentes de graficos personalizados basados en SVG (`SimpleChart`, `CircularProgress`) desarrollados a medida. Estos componentes presentaban varios problemas:

- **Alto costo de mantenimiento**: cualquier cambio en el diseno o comportamiento requeria modificar SVGs a mano.
- **Escasa extensibilidad**: anadir nuevos tipos de graficos (barras, areas, lineas compuestas) implicaba escribir nuevo codigo SVG desde cero.
- **Sin responsividad nativa**: los graficos SVG personalizados no se adaptaban correctamente a diferentes tamanos de pantalla sin logica adicional.
- **Inconsistencia visual**: cada grafico tenia su propio sistema de colores y comportamiento de tooltips.

## Decision

Se adopto **Recharts** como biblioteca estandar para todos los componentes de graficos del panel de control.

Criterios de seleccion:

| Criterio | Recharts |
|---|---|
| Compatibilidad | React 18 nativo |
| API | Declarativa, basada en composicion de componentes |
| Responsividad | `ResponsiveContainer` integrado |
| Tema oscuro | Soporte via CSS variables y props de estilo |
| Tipos de graficos | Line, Bar, Area, Pie, Radar, Scatter, Treemap |
| Mantenimiento | Activo, amplia comunidad |

Los componentes `SimpleChart` y `CircularProgress` fueron reemplazados por equivalentes de Recharts configurados con la paleta Automotive Industrial Dark.

## Consecuencias

### Positivas

- API declarativa reduce el codigo necesario para implementar y modificar graficos
- `ResponsiveContainer` garantiza adaptacion automatica a cualquier tamano de pantalla
- Tooltips, leyendas y animaciones incluidos sin desarrollo adicional
- Consistencia visual entre todos los graficos al compartir la misma configuracion de tema
- Facilita la incorporacion de nuevos tipos de visualizacion en el futuro

### Negativas

- Dependencia adicional en el bundle (`recharts` y sus dependencias transitivas como `d3-*`)
- Menor control pixel-perfect comparado con SVGs personalizados en casos muy especificos
- Curva de aprendizaje inicial para los desarrolladores que no conocen la API de Recharts
