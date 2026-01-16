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

export async function createCamera(cameraId, projectId) {
  // Generar ID compuesto para Firestore
  const firestoreDocId = getFirestoreDocId(projectId, cameraId);
  const ref = doc(db, "cameras", firestoreDocId);

  await setDoc(ref, {
    projectId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

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
    cameraId: firestoreDocId, // ⬅️ Usamos el ID compuesto
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
