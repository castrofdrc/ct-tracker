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

La app se encuentra en una **etapa avanzada de pulido funcional y visual del flujo principal de operaciones**, con foco en la pantalla de creación de nuevas operaciones (`NewOperationScreen`).

Toda la lógica crítica de navegación, selección y confirmación está definida y funcionando de forma estable.

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

---

## Flujo principal: Nueva Operación

### Pantalla: `NewOperationScreen`

Esta pantalla centraliza todo el flujo de registro de una operación y se divide conceptualmente en tres bloques:

1. **Bloque fijo superior**
2. **Bloque móvil de contenido**
3. **Bloque fijo inferior (acciones)**

---

### 1. Bloque fijo superior

Siempre visible y estable:

- **Título:** “NUEVA OPERACIÓN”
- **Subtítulo dinámico:** “Seleccionar cámara” / “Cámara seleccionada”
- **Input de cámara**
  - Muestra la CT seleccionada
  - Permite resetear la selección tocándolo

Este bloque mantiene siempre la misma posición y espaciado, independientemente del estado del flujo.

---

### 2. Bloque móvil de contenido

El contenido interno cambia según el estado del flujo, pero siempre vive dentro de un contenedor con altura fija y scroll interno.

#### a) Selector de cámara (CT Picker)

Se muestra cuando **no hay cámara confirmada**:

- Buscador por ID
- Lista scrollable de CT
- Estado visual:
  - CT seleccionada → fondo gris
- La selección NO confirma la CT
- La confirmación se realiza únicamente con el botón **Aceptar**

No existen estados “zombi”: una CT nunca pasa a activa sin confirmación explícita.

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
- **Colocación**

La selección se refleja visualmente (botón gris), pero no ejecuta ninguna acción.

---

### Operación: Mantenimiento

- Subtítulo: “Tipo de mantenimiento”
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

---

### Operación: Colocación (CT inactiva)

Bloque visualmente equivalente al selector de mantenimiento, manteniendo coherencia estética.

#### Subtítulo
- “INGRESAR UBICACIÓN”

#### Inputs
- Latitud y Longitud
- En la misma línea
- Gap fijo de 10px
- Redondeo visual a 6 decimales

#### Métodos de ubicación
- **Usar ubicación actual**
- **Elegir en el mapa**

Ambos:
- Se comportan como opciones seleccionables
- Se pintan de gris cuando están activos
- Solo uno puede estar activo a la vez

##### Uso del mapa
- Navega a `mapPicker`
- Al volver:
  - Se recuperan lat/lng desde `pendingCameraState`
  - Se marca automáticamente el método “mapa” como seleccionado
- No se resetea el flujo al volver del mapa

---

### 3. Bloque fijo inferior

Siempre visible, sin scroll:

- **Cancelar**
  - Vuelve al `MainScreen`
  - No persiste cambios
- **Aceptar**
  - Función única y central
  - Confirma TODA la operación completa
  - No hay confirmaciones intermedias
  - No existe “¿Confirmar acción?”

El botón se habilita solo cuando:
- Hay CT confirmada
- Hay operación seleccionada
- Se cumplen los requisitos específicos de cada operación

---

## Confirmación de operaciones

Al presionar **Aceptar**:

- **Colocación**
  - `placeCamera(id, lat, lng)`
- **Retiro**
  - `removeCamera(id)`
- **Mantenimiento**
  - `maintenanceCamera(id, maintenanceType)`

Si la operación es exitosa:
- Se vuelve al `MainScreen`
- Se muestra feedback no intrusivo (previsto)

---

## Comportamiento de resets

- Al entrar desde `MainScreen`:
  - Reset total del flujo
- Al volver desde `mapPicker`:
  - NO se resetea nada
- Al cambiar de operación:
  - Se limpian estados dependientes (ej: tipo de mantenimiento, método de ubicación)

Esto garantiza coherencia y evita estados inconsistentes.

---

## Principios de diseño aplicados

- Mobile-first real
- Una sola fuente de verdad
- Confirmación explícita
- Cero estados implícitos
- Estética consistente y predecible
- Cambios incrementales sin romper funcionalidad existente

---

## Estado actual

- Flujo principal de operaciones: **completo y estable**
- UI pulida y coherente
- Código sin estados zombi
- Navegación clara
- Base sólida para:
  - Feedback visual post-acción
  - Overlays
  - Ajustes finos de UX
  - Nuevas operaciones futuras
