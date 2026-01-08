# CT-Tracker — README actualizado

## Descripción general

CT-Tracker es una aplicación **offline-first**, **mobile-first** y orientada a **uso real en campo** para el seguimiento operativo de **cámaras trampa**.  
Permite registrar cámaras, operar sobre ellas mediante eventos históricos y visualizar su estado operativo **derivado**, con foco en **robustez**, **claridad de dominio** y **comportamiento predecible** bajo conectividad intermitente.

El proyecto no persigue “features vistosas”, sino un sistema confiable para trabajo de campo prolongado, pensado desde el inicio como base de una futura **app Android**.

---

## Objetivos del sistema

- Registrar cámaras trampa mediante identificador único.
- Gestionar **operaciones históricas** por cámara.
- Derivar el estado operativo (`active / inactive`) sin flags manuales.
- Permitir operación completa **offline** con sincronización posterior.
- Proveer una UX honesta y consistente en escenarios sin red.
- Mantener un dominio **cerrado**, explícito y sin ambigüedades.
- Servir como base técnica sólida para:
  - mapas offline
  - backend más estricto
  - empaquetado móvil (PWA / WebView)

---

## Modelo de dominio (cerrado)

### Entidad principal

#### Camera
- Identificador único.
- No contiene estado operativo persistido.
- Toda su evolución se explica **exclusivamente** por operaciones.

---

### Estados de cámara

Una cámara **solo puede estar en uno de estos estados**:

- `active`
- `inactive`

No existen estados intermedios, flags auxiliares ni estados “temporales” de dominio.

---

### Operaciones (eventos)

Las operaciones son **eventos históricos inmutables**, no estados.

Operaciones válidas:

- `deploy` – alta lógica de la cámara en el sistema
- `placement` – colocación en campo (define ubicación)
- `relocation` – cambio de ubicación
- `maintenance` – mantenimiento sin retiro
- `removal` – retiro del campo

#### Secuencias válidas

- `deploy → placement → relocation* → maintenance* → removal`
- `deploy → removal` (cámara nunca colocada)

La validación de secuencia:
- Se realiza **en frontend** mediante guards de dominio.
- Backend estricto (Rules / Functions) queda planificado a futuro.

---

### Derivación de estado

El estado `active / inactive`:

- **NO se guarda** como fuente de verdad.
- **NO se manipula manualmente**.
- Se **deriva exclusivamente** del historial confirmado de operaciones.

Esto elimina:
- estados corruptos
- flags inconsistentes
- dependencias temporales frágiles

---

## Offline-first (estado real)

### Soportado actualmente

- La app **abre sin conexión** (PWA).
- Operaciones soportadas offline:
  - `placement`
  - `relocation`
  - `maintenance`
  - `removal`
- Las operaciones:
  - se guardan localmente
  - se sincronizan automáticamente al volver online
- La UI refleja **la intención del usuario**, incluso sin red.

---

### Limitaciones explícitas (no bugs)

Por decisión de diseño, **no se promete**:

- Estado derivado definitivo offline.
- Orden temporal exacto entre operaciones offline.
- Indicador global de “todo sincronizado”.

Estas restricciones están:
- documentadas
- asumidas
- alineadas con un modelo honesto offline-first.

---

## UX offline (decisiones clave)

- Aviso global persistente:  
  **“Sin conexión. Los cambios se guardarán localmente.”**
- Para `placement` y `removal`:
  - La UI cambia de inmediato.
  - Se usa un **estado transitorio de UI**, no de dominio.
- No se:
  - falsifican estados reales
  - simulan timestamps
  - inventan confirmaciones inexistentes
- No existe acción manual de “sincronizar” mientras no haya backend dedicado.

---

## Mapas y visualización

- Mapa interactivo con **Leaflet**.
- Visualización de cámaras y ubicaciones actuales.
- Modo online completo.
- Modo offline funcional (sin tiles offline aún).

### Planificado
- mapas offline
- caché selectiva de tiles
- degradación visual explícita sin red

---

## PWA

Implementada como **PWA real**, no experimental.

### Capacidades actuales

- Instalación como app.
- Precache automático con Workbox:
  - `index.html`
  - bundles JS/CSS versionados por Vite
- Refresh offline **sin pantalla blanca**.
- Comportamiento estable online/offline.

### No implementado aún

- background sync
- push notifications
- mapas offline
- manejo avanzado de versiones

---

## Stack técnico

### Frontend
- React
- Vite
- Leaflet
- PWA con Workbox (`vite-plugin-pwa`)

### Backend
- Firebase Auth
- Firestore (producción)
- Firestore Emulator (testing local)

---

## Testing

- Tests de dominio **puros** (sin Firestore).
- Validación de secuencias críticas en frontend.
- Tests ejecutables en entorno local.
- Sin mocks complejos ni lógica duplicada.

---

## Legacy

- Eliminado completamente:
  - `status_change`
  - operaciones legacy incompatibles
- No existe:
  - data legacy en producción
  - compatibilidad retroactiva pendiente

---

## Estado actual del proyecto

- Dominio: **cerrado y estable**
- UX offline: **resuelta**
- PWA básica: **resuelta**
- App estable en:
  - online
  - offline
  - refresh offline

Lista para avanzar en:
- pulido UX mobile-first
- mapas offline
- endurecimiento backend
- roadmap Android

---

## Principios del proyecto

- Correcto antes que “lindo”
- Dominio claro antes que features
- Offline honesto antes que simulaciones
- Decisiones explícitas, documentadas y sostenibles
