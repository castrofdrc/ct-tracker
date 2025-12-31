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
