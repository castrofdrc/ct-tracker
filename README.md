# CT-Tracker

CT-Tracker es una aplicación web para el seguimiento operativo y espacial de cámaras trampa (camera traps) utilizadas en proyectos de monitoreo de campo.

El foco del sistema no es solo visual, sino registrar de forma auditable y consistente:
- qué pasó con cada cámara,
- cuándo pasó,
- y dónde pasó.

La arquitectura está diseñada para evitar ambigüedades de dominio, facilitar análisis posteriores y habilitar exportaciones limpias.

---

## Objetivos del sistema

- Registrar el ciclo de vida completo de cada cámara.
- Separar explícitamente:
  - Estado (derivado, no persistido)
  - Operaciones (eventos)
  - Ubicaciones (historial espacial)
- Garantizar:
  - trazabilidad,
  - auditoría,
  - consistencia temporal y semántica.
- Preparar la base para:
  - exportaciones CSV,
  - análisis temporal,
  - análisis espacial (GIS).

---

## Principios de diseño

- El estado no es un evento
- El estado no se persiste
- Los eventos son inmutables
- La ubicación es un historial independiente
- Firestore es la fuente de verdad
- La UI deriva, no decide

Estos principios no deben romperse.

---

## Arquitectura general

- Frontend: React (Vite)
- Backend: Firebase
  - Authentication
  - Firestore
  - Firestore Rules estrictas
- Hosting: Firebase Hosting
- Mapa: Leaflet / React-Leaflet

Arquitectura SPA, sin stores globales innecesarios.

---

## Modelo de dominio

### Project

projects/{projectId}

- Agrupa cámaras.
- Define membresía (members: [uid]).
- Controla acceso vía Firestore Rules.

---

### Camera

cameras/{cameraId}

Representa una cámara física.

Campos relevantes:
- projectId
- createdAt
- updatedAt

No tiene estado persistido.  
No tiene ubicación persistida.

La cámara no contiene historial.

---

### Operation (historial operativo)

cameras/{cameraId}/operations/{operationId}

Representa un evento ocurrido.

Tipos válidos:
- deploy: alta en el sistema
- placement: colocación en campo
- relocation: cambio de ubicación
- maintenance: mantenimiento sin retiro
- removal: retiro del campo

Campos:
- cameraId
- projectId
- type
- userId
- createdAt

Características:
- Inmutable
- Sin estado
- Sin ubicación

---

### LocationHistory (historial espacial)

cameras/{cameraId}/locations/{locationId}

Entidad independiente para trazabilidad espacial.

Campos:
- cameraId
- projectId
- lat
- lng
- originOperation (placement | relocation)
- createdAt

Solo se escribe en:
- placement
- relocation

Es la única fuente de verdad para el mapa.

---

## Modelo de estados

Estados válidos:
- active
- inactive

El estado es derivado, nunca persistido.

Derivación del estado actual según la última operación válida:

- deploy → inactive
- placement → active
- relocation → active
- maintenance → active
- removal → inactive

Implementado en:
src/domain/deriveCameraState.js

---

## Flujo funcional

1. Login con Firebase Auth
2. Selección de proyecto según membresía
3. Listado de cámaras
4. Estado mostrado = derivedState
5. Historial operativo visible
6. Mapa usando historial de ubicaciones
7. Acciones del usuario generan operaciones (no estados)

---

## Seguridad (Firestore Rules)

- Acceso restringido por proyecto
- Escrituras estrictas:
  - operaciones sin campos extra
  - ubicaciones separadas
- No se permiten updates de historial
- Reglas alineadas con el dominio

---

## Estado actual del proyecto

- Dominio rediseñado y consolidado
- Historial espacial separado
- Legacy eliminado (camera.location)
- App estable en:
  - local (npm run dev)
  - producción (Firebase Hosting)
- Sin errores de permisos
- Warning de React en desarrollo (StrictMode) aceptado y documentado

---

## Próximos pasos

Prioridad alta:
- Exportaciones:
  - operaciones
  - ubicaciones
  - cámaras

Prioridad media:
- Limpieza final de legacy (status_change, tipos antiguos)
- Endurecimiento adicional de rules

Prioridad baja:
- Documentación extendida
- Diagramas de dominio
- Tests de dominio puros

---

## Notas importantes para desarrollo futuro

- No persistir estado
- No mezclar ubicación con operaciones
- No agregar atajos en la UI
- Todo cambio debe respetar el dominio

---

## Licencia

Pendiente de definir.
