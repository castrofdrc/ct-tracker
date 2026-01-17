import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { createOperation } from "./operations.service";
import { addLocation } from "./locations.service";

// ============================================
// HELPERS PARA IDs COMPUESTOS
// ============================================

/**
 * Genera el ID de documento en Firestore: projectId__cameraId
 * Ejemplo: "proyectoA__CT001"
 */
function getFirestoreDocId(projectId, cameraId) {
  return `${projectId}__${cameraId}`;
}

/**
 * Extrae el cameraId display del ID compuesto de Firestore
 * Ejemplo: "proyectoA__CT001" → "CT001"
 */
export function extractCameraId(firestoreDocId) {
  const parts = firestoreDocId.split("__");
  return parts.length === 2 ? parts[1] : firestoreDocId;
}

/**
 * Extrae el projectId del ID compuesto de Firestore
 * Ejemplo: "proyectoA__CT001" → "proyectoA"
 */
export function extractProjectId(firestoreDocId) {
  const parts = firestoreDocId.split("__");
  return parts.length === 2 ? parts[0] : null;
}

// ============================================
// SERVICIOS PRINCIPALES
// ============================================

export function listenToCameras(projectId, onChange, onError) {
  const q = query(
    collection(db, "cameras"),
    where("projectId", "==", projectId),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const cameras = snapshot.docs.map((doc) => ({
        // ID de Firestore (compuesto): "proyectoA__CT001"
        firestoreId: doc.id,
        // ID display (limpio): "CT001"
        id: extractCameraId(doc.id),
        ...doc.data(),
      }));
      onChange(cameras);
    },
    onError,
  );
}

/**
 * Crea una nueva cámara con campos opcionales
 *
 * @param {string} cameraId - ID display (ej: "CT001")
 * @param {string} projectId - ID del proyecto
 * @param {Object} optionalFields - Campos opcionales
 * @param {string} [optionalFields.brand] - Marca y modelo (máx 50 chars)
 * @param {number} [optionalFields.batteries] - Cantidad de pilas (1-12)
 * @param {number} [optionalFields.sdCapacity] - Capacidad SD en GB (8, 16, 32, 64, 128, 256)
 * @param {string} [optionalFields.comments] - Comentarios (máx 250 chars)
 */
export async function createCamera(cameraId, projectId, optionalFields = {}) {
  // Generar ID compuesto para Firestore
  const firestoreDocId = getFirestoreDocId(projectId, cameraId);
  const ref = doc(db, "cameras", firestoreDocId);

  // Construir objeto de datos base
  const cameraData = {
    projectId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  // Agregar campos opcionales solo si tienen valor
  if (optionalFields.brand && optionalFields.brand.trim()) {
    cameraData.brand = optionalFields.brand.trim().substring(0, 50);
  }

  if (optionalFields.batteries && Number.isInteger(optionalFields.batteries)) {
    // Validar rango 1-12
    const batteries = Math.max(1, Math.min(12, optionalFields.batteries));
    cameraData.batteries = batteries;
  }

  if (
    optionalFields.sdCapacity &&
    Number.isInteger(optionalFields.sdCapacity)
  ) {
    // Validar que sea uno de los valores permitidos
    const validCapacities = [8, 16, 32, 64, 128, 256];
    if (validCapacities.includes(optionalFields.sdCapacity)) {
      cameraData.sdCapacity = optionalFields.sdCapacity;
    }
  }

  if (optionalFields.comments && optionalFields.comments.trim()) {
    cameraData.comments = optionalFields.comments.trim().substring(0, 250);
  }

  await setDoc(ref, cameraData);

  // Crear operación inicial de deploy
  await createOperation(firestoreDocId, projectId, "deploy", {});
}

export async function placeCamera(cameraId, projectId, lat, lng) {
  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  ) {
    throw new Error("Coordenadas inválidas. Lat: -90 a 90, Lng: -180 a 180");
  }

  // Generar ID compuesto
  const firestoreDocId = getFirestoreDocId(projectId, cameraId);

  await createOperation(firestoreDocId, projectId, "placement");
  await addLocation({
    cameraId: firestoreDocId,
    projectId,
    lat,
    lng,
    originOperation: "placement",
  });
}

export async function removeCamera(cameraId, projectId) {
  // Generar ID compuesto
  const firestoreDocId = getFirestoreDocId(projectId, cameraId);

  await createOperation(firestoreDocId, projectId, "removal");
}
