# CT-Tracker

CT-Tracker es una aplicación mobile-first orientada a la gestión operativa de cámaras trampa (CT) en campo. Permite visualizar cámaras sobre un mapa, consultar su estado y registrar operaciones de colocación, mantenimiento y retiro de forma controlada, consistente y trazable.

---

## Objetivo de la aplicación

El objetivo principal de CT-Tracker es ofrecer una herramienta simple, robusta y sin estados ambiguos para registrar acciones reales realizadas sobre cámaras trampa en campo, minimizando errores operativos y mejorando la calidad del registro de datos espaciales y operativos.

La app prioriza:
- Flujo guiado y explícito (nada sucede sin confirmación final).
- Una única fuente de verdad para navegación y estado.
- Interfaz clara, mobile-first, sin layouts heredados de web.
- Separación estricta entre selección, edición y confirmación.

---

## Estado actual del proyecto

La app se encuentra en una **etapa avanzada de desarrollo funcional** con mejoras recientes en UX/UI que optimizan el flujo de operaciones:

- Sistema de overlays para pantallas modales (Settings, NewOperation, NewCamera)
- Flujo optimizado de selección de cámaras con confirmación instantánea
- Auto-selección inteligente de operación "Colocación" para cámaras inactivas
- Validación robusta de coordenadas geográficas
- Interfaz pulida con feedback visual mejorado

---

## Arquitectura general

### Contextos principales
- **UIContext**
  - Maneja navegación (`activeScreen`)
  - Estados temporales de flujo (`selectedCameraId`, `pendingOperation`, `pendingCameraState`, `returningFromMap`)
- **ProjectContext**
  - Contiene las cámaras del proyecto
  - Expone métodos de dominio:
    - `placeCamera`
    - `removeCamera`
    - `maintenanceCamera`
    - `createCamera`

---

## Sistema de Navegación con Overlays

### Pantallas principales
- **MainScreen**: Mapa interactivo con cámaras activas (siempre de fondo)
- **Overlays modales** (sobre el mapa):
  - NewOperationScreen
  - SettingsScreen
  - NewCameraScreen
- **MapPickerScreen**: Pantalla completa para selección de ubicación

### Comportamiento de overlays
- El mapa permanece visible de fondo con borde de ~40px
- TopStatusBar y BottomActionBar se ocultan automáticamente
- Fondo semi-transparente para contexto visual
- MapPickerScreen mantiene pantalla completa sin interferencias

---

## Flujo principal: Nueva Operación

### Pantalla: `NewOperationScreen`

Esta pantalla centraliza todo el flujo de registro de una operación y se divide conceptualmente en tres bloques:

1. **Bloque fijo superior**
2. **Bloque móvil de contenido**
3. **Bloque fijo inferior (acciones)** - Condicional

---

### 1. Bloque fijo superior

Siempre visible y estable:

- **Título:** "NUEVA OPERACIÓN"
- **Subtítulo dinámico:** "Seleccionar cámara" / "Cámara seleccionada"
- **Input de cámara**
  - Muestra la CT seleccionada con fondo gris y texto en negrita
  - Permite resetear toda la operación tocándolo
  - Placeholder: "Seleccionar cámara..."

Este bloque mantiene siempre la misma posición y espaciado, independientemente del estado del flujo.

---

### 2. Bloque móvil de contenido

El contenido interno cambia según el estado del flujo, pero siempre vive dentro de un contenedor con altura flexible y scroll interno.

#### a) Selector de cámara (CT Picker)

Se muestra cuando **no hay cámara confirmada**:

- Buscador por ID
- Lista scrollable de CT con estado visible
- **Confirmación instantánea al clickear** (sin botón "Aceptar")
- El picker ocupa toda la altura disponible
- No requiere pasos adicionales de confirmación

Mejoras UX:
- Selección directa elimina un click innecesario
- Feedback visual inmediato
- Flujo más ágil y natural

---

#### b) Formulario de operación (con CT seleccionada)

Una vez confirmada la CT, el contenido pasa al formulario de operación.

##### Subtítulos
Todos los subtítulos usan la misma estética:
- Uppercase
- Font-size 12
- Margin inferior consistente

Los bloques están separados entre sí por márgenes responsivos, no por gaps globales.

---

### Tipos de operación

Dependen del estado actual de la cámara:

#### CT activa
- **Mantenimiento**
- **Retiro**

#### CT inactiva
- **Colocación** (auto-seleccionada automáticamente)

La selección se refleja visualmente (botón gris), pero no ejecuta ninguna acción hasta confirmar.

**Optimización UX:** Las cámaras inactivas auto-seleccionan "Colocación" al confirmarse, ya que es la única operación válida, eliminando un click innecesario.

---

### Operación: Mantenimiento

- Subtítulo: "Tipo de mantenimiento"
- Opciones:
  - Cambio de pilas
  - Cambio de memoria
  - Pilas y memoria
- Selección visual persistente
- No se ejecuta nada hasta confirmar

---

### Operación: Retiro

- Texto descriptivo informativo
- No requiere inputs adicionales
- Mensaje: "La cámara será retirada del campo y quedará inactiva."

---

### Operación: Colocación (CT inactiva)

Bloque visualmente equivalente al selector de mantenimiento, manteniendo coherencia estética.

#### Mensaje informativo
"La cámara será colocada en el campo y quedará activa."

#### Subtítulo
- "INGRESAR UBICACIÓN"

#### Inputs
- Latitud y Longitud
- En la misma línea
- Gap fijo de 10px
- Validación robusta de rangos geográficos:
  - Latitud: -90 a 90
  - Longitud: -180 a 180
  - No acepta strings vacíos
  - Rechaza valores fuera de rango

#### Métodos de ubicación
- **Usar ubicación actual**
- **Elegir en el mapa**

Ambos:
- Se comportan como opciones seleccionables
- Se pintan de gris cuando están activos
- Solo uno puede estar activo a la vez

##### Uso del mapa
- Navega a `MapPickerScreen` (pantalla completa)
- Al volver:
  - Se recuperan lat/lng desde `pendingCameraState`
  - Se marca automáticamente el método "mapa" como seleccionado
- No se resetea el flujo al volver del mapa
- Interfaz limpia sin barras de navegación

---

### 3. Bloque fijo inferior

Visible **solo cuando hay cámara confirmada**:

- **Cancelar**
  - Vuelve al `MainScreen`
  - No persiste cambios
- **Aceptar**
  - Función única y central
  - Confirma TODA la operación completa
  - No hay confirmaciones intermedias
  - Validación completa antes de habilitar

El botón "Aceptar" se habilita solo cuando:
- Hay CT confirmada
- Hay operación seleccionada
- Se cumplen los requisitos específicos de cada operación
- Para placement: coordenadas válidas dentro de rangos geográficos

---

## Confirmación de operaciones

Al presionar **Aceptar**:

- **Colocación**
  - `placeCamera(id, lat, lng)`
  - Validación de coordenadas en UI y servicio
  - Crea operación + ubicación inicial
- **Retiro**
  - `removeCamera(id)`
- **Mantenimiento**
  - `maintenanceCamera(id, maintenanceType)`
  - Validación de tipo de mantenimiento

Si la operación es exitosa:
- Se vuelve al `MainScreen`
- Overlay se cierra suavemente

---

## Comportamiento de resets

- Al entrar desde `MainScreen`:
  - Reset total del flujo
- Al volver desde `mapPicker`:
  - NO se resetea nada (mantiene contexto)
- Al cambiar de operación:
  - Se limpian estados dependientes (ej: tipo de mantenimiento, método de ubicación)
- Al resetear cámara seleccionada:
  - Se limpian TODOS los estados de operación
  - Vuelve al picker limpio

Esto garantiza coherencia y evita estados inconsistentes o "fantasma".

---

## Sistema de Validaciones

### Validación de coordenadas (doble capa)
1. **UI (NewOperationScreen):**
   - Verifica que sean números válidos
   - Valida rangos geográficos (-90/90, -180/180)
   - Rechaza strings vacíos que se convierten a 0
   - Deshabilita botón "Aceptar" si no cumple

2. **Servicio (cameras.service):**
   - Re-valida coordenadas antes de crear operación
   - Mensaje de error específico
   - Previene datos inválidos en Firestore

### Validación de operaciones
- Mantenimiento requiere tipo válido (battery/sd/both)
- Guards de dominio verifican estado de cámara
- No permite operaciones inconsistentes

---

## Principios de diseño aplicados

- Mobile-first real con overlays nativos
- Una sola fuente de verdad
- Confirmación explícita
- Cero estados implícitos o "fantasma"
- Estética consistente y predecible
- Cambios incrementales sin romper funcionalidad existente
- Auto-optimización de flujos cuando es obvio (CT inactiva → Colocación)
- Validaciones en múltiples capas (defensa en profundidad)

---

## Mejoras Recientes

### UX/UI
- Sistema de overlays con mapa visible de fondo
- Confirmación instantánea en selector de CT
- Auto-selección de operación "Colocación" para CTs inactivas
- Feedback visual mejorado (grises, negritas)
- Eliminación de clicks innecesarios
- Limpieza completa de estados al resetear

### Validación y Robustez
- Validación robusta de coordenadas geográficas
- Prevención de estados "fantasma" al cambiar de CT
- Reset completo de estados al cambiar de proyecto
- Manejo correcto de navegación mapa ↔ operación

### Arquitectura
- Separación clara entre pantallas full-screen y overlays
- MainScreen como base permanente
- MapPickerScreen sin interferencias del overlay
- Componente ScreenOverlay reutilizable

---

## Estado actual

- Flujo principal de operaciones: **completo y optimizado**
- UI pulida y coherente con overlays nativos
- Código sin estados zombi o fantasma
- Navegación clara y predecible
- Validaciones robustas en múltiples capas
- Base sólida para:
  - Feedback visual post-acción
  - Animaciones y transiciones
  - Nuevas operaciones futuras
  - Modo offline

---

## Próximos Pasos (Roadmap)

### PRIORIDAD ALTA
1. Feedback post-operación (toast, confirmación visual)
2. Estados de loading en operaciones
3. Micro-animaciones sutiles (transiciones de overlay)

### PRIORIDAD MEDIA
1. Revisión final de edge-cases
2. Mejoras en mensajes de error
3. Optimizaciones de rendimiento

### PRIORIDAD BAJA
1. Historial de operaciones
2. Edición de operaciones pasadas
3. Modo offline completo
