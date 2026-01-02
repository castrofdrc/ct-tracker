# CT-Tracker

CT-Tracker es una aplicación web para el **seguimiento operativo de cámaras trampa**, orientada a registrar **eventos reales de campo** (despliegue, colocación, relocalización, mantenimiento y retiro), manteniendo un **historial auditable**, un **modelo de dominio explícito** y una visualización geoespacial consistente.

---

## Objetivo de la aplicación

- Registrar **qué pasa con cada cámara**, no solo su estado actual.
- Separar claramente:
  - **eventos** (operations)
  - **estado derivado** (active / inactive)
  - **historial espacial** (locations)
- Evitar estados implícitos, mutaciones silenciosas y correcciones no auditables.
- Preparar la base para análisis posteriores, exportaciones y trabajo multiusuario.

---

## Modelo de dominio

### 1. Cameras

Colección raíz: cameras/{cameraId}
Contiene únicamente **metadatos estáticos** de la cámara.

No almacena ubicación ni estado mutable.

El estado (`active` / `inactive`) se **deriva exclusivamente** del historial de operaciones.

---

### 2. Operations (eventos)

Subcolección: cameras/{cameraId}/operations/{operationId}
Cada documento representa un **evento real** ocurrido sobre la cámara.

Tipos de operación válidos:

| Tipo | Descripción |
|---|---|
| deploy | Alta de la cámara en el sistema |
| placement | Colocación en el campo |
| relocation | Cambio de ubicación |
| maintenance | Mantenimiento sin retiro |
| removal | Retiro del campo |

Campos relevantes:
- `type`
- `createdAt`
- `userId`
- `maintenanceType` (solo para maintenance)

#### maintenanceType
Valores posibles:
- `battery`
- `sd`
- `both`

El mantenimiento **no cambia el estado** de la cámara.

---

### 3. Locations (historial espacial)

Subcolección: cameras/{cameraId}/locations/{locationId}
Cada documento representa una **ubicación histórica** asociada a un evento (`placement` o `relocation`).

Reglas clave:
- Nunca se edita una ubicación existente.
- Cada relocalización crea **una nueva location**.
- No existe `camera.location` como fuente de verdad.

---

### 4. Estado derivado

El estado de la cámara **no se guarda**.

Se calcula dinámicamente a partir de las operaciones:

- `active` → última operación relevante es `placement` o `relocation`
- `inactive` → última operación relevante es `removal` o solo `deploy`

Función central: deriveCameraState(operations)

---

## Mapa (Leaflet)

### Principios

- El mapa es una **herramienta de acción**, no solo de visualización.
- El mapa **siempre renderiza**, incluso si no hay cámaras o ubicaciones.
- Nunca se renderiza `FitBounds` con coordenadas inválidas.

### Comportamiento

- 0 cámaras con ubicación  
  → mapa centrado en un punto por defecto.
- 1 cámara con ubicación  
  → el mapa se centra automáticamente en esa cámara.
- 2 o más cámaras con ubicación  
  → `FitBounds` ajusta la vista global.

### Reglas técnicas

- Solo se consideran ubicaciones donde:
  - `lat` y `lng` son `Number.isFinite`
- `FitBounds` se renderiza **solo si hay 2+ ubicaciones válidas**.
- Para 1 cámara seleccionada se usa un componente dedicado de centrado (`CenterOnCamera`).

Esto evita errores de Leaflet como: `Attempted to load an infinite number of tiles`

---

## Relocalización manual

Además del click en el mapa, existe un **panel explícito de relocalización manual**.

Características:
- Inputs numéricos (`lat`, `lng`)
- Acción explícita: **“Relocalizar cámara”**
- Internamente dispara:
  - operación `relocation`
  - nueva entrada en `locations`

Nunca se edita una ubicación existente.

---

## Mantenimiento

Cada cámara activa puede recibir mantenimiento mediante un panel dedicado:

- Selector de tipo:
  - Cambio de baterías
  - Cambio de memoria
  - Ambos
- Genera una operación `maintenance`
- Se refleja en el historial
- No modifica ubicación ni estado

---

## Usuarios y displayName

- Cada operación guarda `userId`.
- El nombre visible del usuario se resuelve desde:
  `users/{uid}`
  `displayName: string`
- El historial muestra:
  `maintenance — 03/01/2026 — por Juan Pérez`

---

### Reglas de seguridad
- Cada usuario solo puede leer su propio documento `users/{uid}`.
- Escritura de usuarios reservada para backend/admin.

---

## Autenticación y Logout

- Autenticación con Firebase Auth.
- Logout correcto incluye:
  - `signOut`
  - limpieza explícita del estado UI:
    - proyecto seleccionado
    - cámara seleccionada
    - filtros
    - inputs temporales

Evita estado zombi entre sesiones.

---

## Eliminación de cámaras

Actualmente **no implementado** en frontend.

Diseño previsto:
- Hard delete completo (cámara + operaciones + locations)
- Confirmación explícita en UI
- Ejecución vía backend / Cloud Function

---

## Stack tecnológico

- Frontend: React + Vite
- Mapa: Leaflet + react-leaflet
- Backend: Firebase
  - Authentication
  - Firestore
  - Firebase Hosting
- Estado: React hooks + Context API
- Sin Redux / Zustand

---

## Principios de diseño

- Dominio explícito antes que conveniencia UI
- Eventos > estados mutables
- Historial siempre auditable
- Nada se “corrige” sin dejar rastro
- UI alineada al dominio, no al revés

---

## Estado actual del proyecto

- MVP funcional completo
- Dominio consolidado
- Legacy de ubicación eliminado
- Mapa estable y robusto
- Base lista para:
  - validación de secuencias
  - hard delete
  - tests de dominio
  - mejoras UX

---

## Próximos pasos recomendados

1. Validación de secuencias de operaciones
2. Hard delete seguro de cámaras
3. Tests unitarios de dominio
4. Pulido UX (mensajes, confirmaciones, accesibilidad)
5. Exportaciones / reporting
