# ADR-006: Proteccion de sesion por inactividad

**Estado:** Aceptada
**Fecha:** 2026-03-28

## Contexto

La aplicacion no tenia ningun mecanismo de expiracion de sesion. Los usuarios podian permanecer autenticados indefinidamente sin interaccion, lo que representaba un riesgo de seguridad especialmente en equipos compartidos o cuando se dejaba la sesion abierta sin supervision.

Adicionalmente, existia otro problema: el cierre de sesion podia ocurrir de forma accidental mediante la navegacion del navegador (boton atras, cierre de pestana), lo que resultaba en una experiencia de usuario frustrante.

## Decision

Se implemento el hook `useMonitorInactividad` con el siguiente comportamiento:

### Logica de timeout

- **Tiempo de inactividad**: 15 minutos sin interaccion del usuario
- **Aviso previo**: modal de advertencia 60 segundos antes del cierre automatico
- **Cierre automatico**: la sesion se cierra automaticamente al expirar el contador del modal

### Comportamiento del cierre de sesion

- El cierre de sesion **solo** ocurre mediante:
  1. Clic explicito en el boton "Cerrar sesion"
  2. Expiracion del timeout de inactividad (15 minutos)
- La navegacion del navegador (atras, recarga, cierre de pestana) **no** cierra la sesion

### Persistencia y sincronizacion

- El estado de sesion persiste entre recargas de pagina mediante `localStorage`
- La sincronizacion entre pestanas se realiza mediante eventos `storage`, garantizando que el cierre en una pestana se propague a las demas

### Eventos que reinician el contador de inactividad

- Movimiento del raton
- Pulsacion de teclas
- Eventos de toque (dispositivos moviles)
- Scroll

## Consecuencias

### Positivas

- Mejora significativa de la seguridad en sesiones no atendidas o equipos compartidos
- El aviso previo de 60 segundos evita cierres de sesion inesperados para usuarios activos
- La persistencia en `localStorage` elimina la friccion de tener que iniciar sesion en cada recarga
- La sincronizacion entre pestanas garantiza coherencia en el estado de autenticacion
- El cierre de sesion intencional queda claramente delimitado y controlado

### Negativas

- El uso de `localStorage` para persistir la sesion puede ser un vector de ataque XSS si no se gestiona adecuadamente el contenido almacenado
- El timeout de 15 minutos puede resultar corto para usuarios que trabajan con documentos largos sin interaccion con el raton (e.g., lectura prolongada); puede requerir ajuste futuro
- La sincronizacion entre pestanas via eventos `storage` no funciona entre origenes distintos ni en algunos navegadores con politicas de privacidad estrictas
