# ADR-002: Eliminacion de styled-components

**Estado:** Aceptada
**Fecha:** 2026-03-28

## Contexto

La pagina `UsersManagementPage` utilizaba `styled-components` para su estilado, mientras que el resto del proyecto usaba exclusivamente Tailwind CSS. Esta inconsistencia generaba dos problemas principales:

1. **Mantenimiento fragmentado**: los desarrolladores debian conocer y alternar entre dos paradigmas de estilado distintos dentro del mismo proyecto.
2. **Bundle innecesariamente grande**: `styled-components` introduce un runtime de CSS-in-JS que no se justificaba siendo Tailwind la herramienta principal.

La coexistencia de ambos sistemas era resultado de migraciones incrementales sin un criterio unificado, no de una decision deliberada de arquitectura.

## Decision

Se elimino `styled-components` del proyecto de forma completa. Todos los componentes del panel de control utilizan Tailwind CSS como unico sistema de estilado.

Los estilos existentes de `styled-components` en `UsersManagementPage` fueron reescritos como clases utilitarias de Tailwind, manteniendo la misma apariencia visual.

## Consecuencias

### Positivas

- Un unico sistema de estilado en todo el proyecto facilita la incorporacion de nuevos desarrolladores
- Eliminacion del runtime de `styled-components` reduce el tamano del bundle de produccion
- Los estilos de Tailwind se comprimen mejor con PurgeCSS/Treeshaking en build
- Mayor consistencia con el resto del codigo del proyecto
- Mejor rendimiento en tiempo de ejecucion al no generar clases CSS dinamicamente

### Negativas

- Refactorizacion puntual necesaria para migrar los estilos existentes
- Se pierde la capacidad de estilos dinamicos basados en props de React sin recurrir a clases condicionales de Tailwind (aunque esto es manejable con `clsx`/`cn`)
