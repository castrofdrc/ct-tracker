# CT-Tracker

CT-Tracker es una aplicación **mobile-first** y **offline-first** para la **gestión operativa de cámaras trampa (CT)** en campo.  
Está diseñada para uso real por técnicos en terreno, con conectividad intermitente, priorizando simplicidad, consistencia de dominio y registro confiable de operaciones.

---

## Objetivo de la aplicación

El objetivo principal de CT-Tracker es permitir:

- Gestionar cámaras trampa en campo de forma operativa
- Registrar **operaciones reales** sobre cada cámara
- Mantener un **historial inmutable y confiable**
- Derivar el estado de cada cámara **exclusivamente desde sus operaciones**
- Evitar ambigüedades de uso (una sola forma válida de hacer cada cosa)
- Funcionar correctamente **offline**, sincronizando luego

CT-Tracker **no es**:
- un dashboard analítico
- una app de escritorio
- una herramienta de edición masiva

Es una herramienta de **trabajo en campo**, pensada para dispositivos móviles.

---

## Principios fundamentales de diseño

- **Offline-first**: las operaciones válidas no se bloquean por falta de conexión
- **Event sourcing simple**: todo cambio relevante es una operación
- **Estado derivado**: no se persiste estado calculable
- **Una sola verdad**: no hay caminos alternativos para la misma acción
- **UX defensiva**: la UI no permite operaciones inválidas

---

## Modelo de dominio

### Cámara Trampa (CT)

Cada cámara existe como un documento en:

*cameras/{cameraId}*

Campos relevantes actuales:
- `projectId`
- `createdAt`

Campos **eliminados conceptualmente**:
- `status` (legacy)
- `updatedAt`

El documento de la cámara **no guarda estado operativo**.

---

### Estado de la cámara (derivado)

El estado de una CT se deriva **exclusivamente** a partir de sus operaciones, usando: 
*deriveCameraState(operations)*

Estados posibles:
- `inactive`
- `active`

---

## Reglas definitivas de operación

### Cámara INACTIVA

- **ÚNICA operación válida**: `placement`
- `placement`:
  - activa la cámara
  - **debe registrar una ubicación**
  - no pueden existir cámaras activas sin ubicación

---

### Cámara ACTIVA

Operaciones válidas:
- `maintenance`
- `removal`

- `maintenance`:
  - no cambia el estado
- `removal`:
  - pasa la cámara a inactiva

---

### Operaciones eliminadas

- ❌ `relocation`  
  Fue eliminada para evitar ambigüedad.
  La relocalización se realiza mediante: 
*removal → placement (con nueva ubicación)*

No existen dos caminos para hacer lo mismo.

---

## Operaciones (eventos)

Las operaciones se almacenan en:

*cameras/{cameraId}/operations/{operationId}*

Son **append-only**.

### Tipos de operación

#### placement
- Activa la cámara
- Debe ir acompañada de una ubicación
- No existe placement sin ubicación

#### maintenance
- Solo para cámaras activas
- Subtipos:
  - `battery`
  - `sd`
  - `both`
- No cambia el estado

#### removal
- Solo para cámaras activas
- Pasa la cámara a inactiva

---

## Ubicaciones

Las ubicaciones se almacenan en:

*cameras/{cameraId}/locations/{locationId}*

Características:
- Historial completo (append-only)
- Cada ubicación tiene:
  - `lat`
  - `lng`
  - `originOperation` (placement)
  - `createdAt`

No existe un campo persistido `camera.location`.  
La ubicación actual se obtiene escuchando la **última ubicación registrada**.

---

## Arquitectura técnica

### Backend
- Firebase Firestore
- Firebase Auth
- Persistencia offline habilitada
- Estrategia:
  - last-write-wins
  - sin resolución avanzada de conflictos (aceptado)

---

### Dominio

Ubicación: *src/domain/*

Componentes clave:
- `deriveCameraState`
- `operationGuards`

El dominio está considerado **cerrado**:
- no se reescribe
- no se duplica lógica en UI

---

### Services

Ubicación: *src/services/*

Responsables de:
- escritura en Firestore
- validaciones de dominio
- guards de operación

Ninguna screen escribe directamente en Firestore.

---

## UI y navegación

### Principio central

- Navegación declarativa
- Una sola fuente de verdad: `activeScreen`
- Cada pantalla es **full screen**
- No existe layout web ni navegación híbrida

Screens actuales:
- `home`
- `projects`
- `main`
- `newAction`
- `mapPicker`
- `settings`

---

### MainScreen

Pantalla central de la app.

Contiene:
- Mapa fullscreen
- Barra superior de estado
- Barra inferior de acciones

Funciones:
- Visualizar cámaras activas
- Acceder a:
  - Nueva operación
  - Ajustes

---

### NewOperationScreen

Pantalla principal para operar cámaras.

Características:
- Selector de cámara
- Operaciones mostradas según estado derivado
- Flujos claros:
  - Colocación (CT inactiva)
  - Mantenimiento (CT activa)
  - Retiro (CT activa)
- Confirmación explícita
- Se resetea correctamente entre operaciones

---

### MapPickerScreen

Pantalla dedicada solo al mapa para selección de ubicación.

Características:
- FitBounds a cámaras ya ubicadas
- Click en mapa → marker
- Confirmación explícita
- Retorna a NewOperationScreen
- No deja estado residual

---

## Estado actual del proyecto

### Funcionalidad completa y estable

- Dominio definido y consistente
- Eliminación total de `relocation`
- Estado derivado desde operaciones
- Placement atómico (operación + ubicación)
- Maintenance funcional (3 tipos)
- Removal funcional
- Map Picker estable
- Offline-first operativo
- Firebase consistente

---

### Funcionalidad pendiente (consciente)

- Lista de cámaras (UI)
- Historial de operaciones (UI)
- Historial de ubicaciones (UI)
- UI definitiva de creación de cámaras
- Indicadores de “última actividad”
- Pulido visual final

---

## Próximos pasos recomendados (prioridad)

### Alta
1. UI de creación de cámara (simple y funcional)
2. Lista de cámaras con:
   - filtro por estado derivado
   - orden por última actividad (derivada)

### Media
3. Historial de operaciones
4. Historial de ubicaciones

### Baja
5. Pulido visual
6. Micro-interacciones
7. Animaciones
8. Refinamiento UX

---

## Principios para continuar el desarrollo

- No persistir datos derivados
- No duplicar lógica de dominio
- No inventar caminos alternativos
- Trabajar screen por screen
- Si algo se rompe, volver atrás

---

CT-Tracker, en su estado actual, ya es **usable en campo**.
El trabajo restante es principalmente **UI y presentación**, no estructural.
