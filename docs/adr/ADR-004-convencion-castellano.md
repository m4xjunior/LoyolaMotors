# ADR-004: Convencion de nomenclatura en castellano

**Estado:** Aceptada
**Fecha:** 2026-03-28

## Contexto

El codigo del proyecto mezclaba tres idiomas en la nomenclatura de archivos, componentes, variables y rutas: portugues (del desarrollo inicial), ingles (de convenciones genericas) y espanol (del dominio del negocio). Esta mezcla generaba confusion, dificultaba la comprension del codigo y era incoherente con el hecho de que el negocio, sus usuarios y su mercado son de habla hispana.

Ejemplos del problema:
- Archivo: `UsersManagementPage.jsx` (ingles)
- Ruta: `/dashboard` (ingles)
- Variable: `listaUsuarios` (espanol) junto a `userList` (ingles) en el mismo archivo

## Decision

Todos los nuevos artefactos de codigo (archivos, componentes, variables, constantes, rutas) se nombran en **castellano** (espanol).

Los archivos existentes con nombres en ingles o portugues se renombraron usando `git mv` para preservar el historial de cambios.

Cambios de rutas aplicados:
- `/dashboard` -> `/panel`
- `/users` -> `/usuarios`
- `/invoices` -> `/facturas`
- `/settings` -> `/configuracion`

### Excepcion

Los componentes de **shadcn/ui** permanecen en ingles, respetando la convencion del proyecto upstream y facilitando la actualizacion de dichos componentes desde la fuente original.

## Consecuencias

### Positivas

- Nomenclatura coherente con el idioma del negocio y sus usuarios
- Facilita la incorporacion de nuevos desarrolladores hispanohablantes
- Las rutas en castellano mejoran la experiencia de usuario al ser mas legibles en la barra de direcciones
- Reduce la ambiguedad al leer el codigo (el dominio del negocio y el codigo hablan el mismo idioma)

### Negativas

- El renombramiento de archivos via `git mv` puede generar conflictos en ramas antiguas o PRs en curso
- La excepcion de shadcn/ui introduce una inconsistencia menor pero necesaria
- Algunos terminos tecnicos no tienen traduccion natural al castellano y pueden requerir criterio caso por caso (e.g., hooks, utils)
