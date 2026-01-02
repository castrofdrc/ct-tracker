import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";

/**
 * Registra una ubicación histórica para una cámara.
 * NO reemplaza camera.location.
 * NO modifica operaciones.
 */
export async function addLocation({
  cameraId,
  projectId,
  lat,
  lng,
  originOperation,
}) {
  const ref = collection(db, "cameras", cameraId, "locations");

  await addDoc(ref, {
    cameraId,
    projectId,
    lat,
    lng,
    originOperation, // "placement" | "relocation"
    createdAt: serverTimestamp(),
  });
}

/**
 * Escucha la última ubicación de una cámara.
 * Devuelve { lat, lng } o null.
 */

export function listenToLastLocation(cameraId, onChange, onError) {
  const q = query(
    collection(db, "cameras", cameraId, "locations"),
    orderBy("createdAt", "desc"),
    limit(1),
  );

  return onSnapshot(
    q,
    (snap) => {
      if (snap.empty) {
        onChange(null);
        return;
      }
      const doc = snap.docs[0];
      const { lat, lng } = doc.data();
      onChange({ lat, lng });
    },
    onError,
  );
}

export function listenToLocations(cameraId, onChange, onError) {
  const q = query(
    collection(db, "cameras", cameraId, "locations"),
    orderBy("createdAt", "desc"),
  );

  return onSnapshot(
    q,
    (snap) => {
      const locations = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      onChange(locations);
    },
    onError,
  );
}
