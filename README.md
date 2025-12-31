# CT Tracker — MVP v0.2.0

CT Tracker es una aplicación web para el seguimiento operativo de cámaras trampa (camera traps).

## Objetivo

Gestionar cámaras físicas identificadas de forma única, registrar cambios de estado y ubicación, mantener un historial auditable de operaciones y visualizar cámaras georreferenciadas en un mapa.

La aplicación es operativa, no analítica.

---

## Stack

* React + Vite
* Firebase Auth
* Firestore
* React-Leaflet
* Firebase Hosting

---

## Modelo de datos

### projects/{projectId}

```json
{
  "members": ["uid", "..."]
}
```

* Define el límite de seguridad
* El frontend **no crea ni modifica proyectos**
* Todo acceso depende de la pertenencia al proyecto

---

### cameras/{cameraId}

```json
{
  "projectId": "string",
  "status": "active | inactive | broken | lost",
  "location": { "lat": number | null, "lng": number | null },
  "createdAt": timestamp,
  "updatedAt": timestamp
}
```

* `cameraId` es semántico (ej: CT_001)
* `projectId` y `createdAt` son inmutables
* Solo se permite cambiar **status o location**, nunca ambos

---

### cameras/{cameraId}/operations/{operationId}

```json
{
  "projectId": "string",
  "type": "deploy | status_change | relocate",
  "userId": "uid",
  "statusAfter": "string?",
  "location": { "lat": number, "lng": number }?,
  "createdAt": timestamp
}
```

* Append-only
* No se puede editar ni borrar
* Toda mutación de cámara genera una operación

---

## Estado actual (v0.2.0)

* MVP funcional consolidado
* Soporte multi-proyecto mediante selector
* Acceso a proyectos restringido por Firestore Rules (`projects.members`)
* Arquitectura separada por capas (auth / project / services / ui)
* Historial de operaciones append-only y auditable
* Sin roles (decisión consciente)

---

## Running local

```bash
npm install
npm run dev
```

El uso de Firebase Emulator es opcional y se controla manualmente desde `firebase.js`.

---

## Notas de alcance

Este release (`v0.2.0`) consolida una base estable y segura.

No incluye:
- roles (admin/editor/viewer)
- exportación de datos
- auditoría avanzada
- tests automatizados

Estas funcionalidades quedan explícitamente fuera de alcance en esta versión.

---

# Checklist de testing formal (CT-Tracker)

👉 **Objetivo**
Definir un procedimiento **determinístico** para validar que la app funciona **antes y después** de cualquier cambio.

👉 **Formato recomendado**
Agregar una nueva sección al final del `README.md` (o crear `docs/testing-checklist.md` si preferís separar; recomiendo README por ahora).

---

## 1. Entorno de prueba

**Precondiciones obligatorias**

* Branch: `main`
* Tag base: `v0.2.0` o superior
* `USE_EMULATOR = false`
* Usuario autenticado con:

  * acceso a ≥ 1 proyecto
  * permisos reales en Firestore
* Proyecto con:

  * ≥ 1 cámara
  * ≥ 1 cámara con ubicación
  * historial existente

Si alguna precondición no se cumple → **el test no es válido**.

---

## 2. Auth

### 2.1 Login válido

**Pasos**

1. Abrir la app
2. Ingresar email válido
3. Ingresar password válido
4. Click en “Login”

**Resultado esperado**

* No errores en consola
* Se renderiza el selector de proyecto

---

### 2.2 Login inválido

**Pasos**

1. Email válido
2. Password incorrecto
3. Click en “Login”

**Resultado esperado**

* Login falla
* La app no se rompe
* No acceso a proyectos

---

## 3. Selector de proyecto

### 3.1 Usuario con proyectos

**Pasos**

1. Usuario autenticado
2. Esperar carga

**Resultado esperado**

* Lista de proyectos visibles
* Cada botón corresponde a un `projectId` real

---

### 3.2 Selección de proyecto

**Pasos**

1. Click en un proyecto

**Resultado esperado**

* `selectedProjectId` se setea
* Se renderiza mapa + lista de cámaras
* No quedan datos de proyectos previos

---

### 3.3 Usuario sin proyectos

**Pasos**

1. Login con usuario sin membresías

**Resultado esperado**

* Mensaje: “No tenés acceso a ningún proyecto”
* No crashes
* No accesos parciales

---

## 4. Cámaras

### 4.1 Listado

**Resultado esperado**

* Lista coincide con Firestore
* Estados correctos
* IDs semánticos (`CT_XXX`)

---

### 4.2 Crear cámara (válido)

**Pasos**

1. Ingresar `CT_999`
2. Click “Crear cámara”

**Resultado esperado**

* Cámara aparece en lista
* Estado inicial: `inactive`
* Operación `deploy` creada

---

### 4.3 Crear cámara (inválido)

**Pasos**

1. Ingresar `CT_9`
2. Click “Crear cámara”

**Resultado esperado**

* Alerta de formato inválido
* No se escribe en Firestore

---

## 5. Cambio de estado

### 5.1 Cambio válido

**Pasos**

1. Seleccionar cámara
2. Cambiar estado (`active → broken`)

**Resultado esperado**

* Estado se actualiza
* Nueva operación `status_change`
* `statusAfter` correcto
* Sin errores en consola

---

### 5.2 Cambio redundante

**Pasos**

1. Cambiar al mismo estado actual

**Resultado esperado**

* No se crea operación nueva
* Estado no se duplica

---

## 6. Relocalización

### 6.1 Desde mapa

**Pasos**

1. Seleccionar cámara
2. Click en mapa

**Resultado esperado**

* Coordenadas se actualizan
* Operación `relocate` creada
* Historial actualizado

---

### 6.2 Cámara sin selección

**Pasos**

1. Click en mapa sin cámara seleccionada

**Resultado esperado**

* No pasa nada
* No errores

---

## 7. Historial

### 7.1 Orden

**Resultado esperado**

* Orden descendente por `createdAt`
* Última operación arriba

---

### 7.2 Expansión

**Pasos**

1. Cámara con >3 operaciones
2. Click “Ver más”

**Resultado esperado**

* Se muestran todas
* Toggle funciona

---

## 8. Seguridad (backend)

### 8.1 Proyecto ajeno

**Pasos**

1. Forzar `projectId` manualmente (DevTools)

**Resultado esperado**

* Permission denied
* No datos visibles
* App no se rompe

---

### 8.2 Escrituras no permitidas

**Resultado esperado**

* Delete cámara → bloqueado
* Update múltiple (`status + location`) → bloqueado

---

## 9. Producción (Hosting)

### 9.1 Smoke test

Repetir:

* login
* selector
* cambio de estado
* relocalización

**Resultado esperado**

* Igual que local
* Sin errores críticos

---

## 10. Criterio de aprobación

El sistema **aprueba** si:

* Todos los resultados esperados se cumplen
* No hay errores persistentes en consola
* Firestore refleja exactamente lo esperado

---
