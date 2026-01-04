# CT-Tracker — Estado actual del proyecto

## Descripción general

CT-Tracker es una aplicación **offline-first** para el seguimiento operativo de **cámaras trampa en campo**.  
Permite registrar cámaras, su estado operativo y su historial de operaciones y ubicaciones, priorizando el uso **en móvil**, **en condiciones de conectividad intermitente**.

La aplicación está diseñada para **uso real en campo**, no como un sistema teórico: todas las decisiones técnicas priorizan robustez, claridad de dominio y comportamiento predecible.

---

## Objetivos del sistema

- Registrar cámaras trampa por identificador único.
- Mantener un historial completo de operaciones por cámara.
- Determinar el estado operativo **active / inactive** de forma derivada.
- Permitir operar **offline**, con sincronización posterior.
- Evitar inconsistencias de dominio o “estados mágicos”.
- Servir como base sólida para una futura app Android.

---

## Modelo de dominio (cerrado)

### Estados de cámara

La cámara **solo puede estar en uno de estos estados**:

- `active`
- `inactive`

No existen otros estados.

---

### Operaciones (eventos)

Las operaciones son **eventos históricos**, no estados.

Operaciones válidas:

- `deploy` – alta de la cámara en el sistema
- `placement` – colocación en campo
- `relocation` – cambio de ubicación
- `maintenance` – mantenimiento sin retiro
- `removal` – retiro del campo

Secuencias válidas:

- `deploy → placement → relocation* → maintenance* → removal`
- `deploy → removal` (sin placement)

La validación de secuencia se realiza **en frontend (guards)**.  
Backend (Cloud Functions / Rules) queda planificado para más adelante.

---

### Derivación de estado

El estado `active / inactive` **NO se guarda** explícitamente como fuente de verdad.

Se **deriva exclusivamente** a partir del historial de operaciones confirmado por Firestore.

Esto evita:
- ambigüedad
- corrupción de estado
- dependencia de flags manuales

---

## Offline-first (estado real)

### Qué está soportado

- La app **abre sin conexión** (PWA).
- Las cámaras existentes pueden operarse offline:
  - placement
  - relocation
  - maintenance
  - removal
- Las operaciones se guardan localmente y se sincronizan al volver online.
- La UI refleja **la intención del usuario** cuando coloca o retira una cámara, incluso offline.

### Qué NO se promete (por diseño)

- Estado derivado definitivo offline.
- Orden temporal exacto de operaciones offline.
- Indicador global de “sincronización completa”.

Estas limitaciones son **reconocidas y documentadas**, no bugs.

---

## UX offline (decisiones clave)

- Se muestra aviso global: "Sin conexión. Los cambios se guardarán localmente."
- Para `placement` / `removal`:
- La UI refleja inmediatamente el cambio visual.
- Se usa un estado **transitorio de UI**, no de dominio.
- No se falsea estado real ni se simulan timestamps.
- No se implementa “sincronizar” manual mientras no haya backend.

---

## PWA (cerrado)

La app es una **PWA funcional** usando `vite-plugin-pwa` (Workbox).

Capacidades actuales:
- Instalación como app.
- Precache automático de:
- `index.html`
- JS/CSS con hash de Vite
- Refresh offline **sin pantalla blanca**.

No se implementa aún:
- mapas offline
- background sync
- push notifications

---

## Stack técnico

### Frontend
- React
- Vite
- Leaflet (mapa)
- PWA con Workbox (`vite-plugin-pwa`)

### Backend
- Firebase Auth
- Firestore (producción)
- Firestore Emulator (testing local)

---

## Testing

- Tests de dominio **puros** (sin Firestore).
- Tests corriendo en local.
- Validaciones críticas de secuencia en frontend.

---

## Legacy

- Eliminado completamente:
- `status_change`
- operaciones legacy incompatibles
- No existe data legacy en producción que requiera compatibilidad.

---

## Estado actual del proyecto

- Dominio: **cerrado**
- Offline UX: **resuelto**
- PWA básica: **resuelta**
- App estable en:
- online
- offline
- refresh offline

El proyecto está listo para avanzar en:
- pulido UX mobile-first
- diseño de mapas offline
- documentación de roadmap backend
- empaquetado Android (PWA / WebView)

---

## Principios del proyecto

- Correcto antes que “lindo”
- Dominio claro antes que features
- Offline honesto antes que simulaciones
- Decisiones explícitas y documentadas
