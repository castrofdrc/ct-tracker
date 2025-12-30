# CT Tracker — MVP v0.1.0

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

## Estado actual

* MVP funcional estabilizado
* Un único proyecto activo (`proj_1`)
* `projectId` definido de forma fija en el frontend (decisión deliberada)
* Sin Context API ni store global
* Sin soporte multi-proyecto (intencional)

---

## Running local

```bash
npm install
npm run dev
```

El uso de Firebase Emulator es opcional y se controla manualmente desde `firebase.js`.

---

## Notas importantes

Este MVP es la **base estable** del proyecto.
El soporte multi-proyecto y el refactor arquitectónico se abordarán en fases posteriores.
