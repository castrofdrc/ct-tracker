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

export function listenToCameras(projectId, onChange, onError) {
  const q = query(
    collection(db, "cameras"),
    where("projectId", "==", projectId),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const cameras = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      onChange(cameras);
    },
    onError,
  );
}

export async function createCamera(cameraId, projectId) {
  const ref = doc(db, "cameras", cameraId);

  await setDoc(ref, {
    projectId,
    status: "inactive",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await createOperation(cameraId, projectId, "deploy", {});
}

export async function placeCamera(cameraId, projectId, lat, lng) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw new Error("Placement requiere ubicación válida");
  }

  // 1. Crear operación placement (esto activa la cámara)
  await createOperation(cameraId, projectId, "placement");

  // 2. Registrar ubicación inicial
  await addLocation({
    cameraId,
    projectId,
    lat,
    lng,
    originOperation: "placement",
  });
}

export async function removeCamera(cameraId, projectId) {
  await createOperation(cameraId, projectId, "removal");
}
