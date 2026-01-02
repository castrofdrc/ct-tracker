import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  getDoc,
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

  await createOperation(cameraId, projectId, "deploy", {
    statusAfter: "inactive",
  });
}

export async function updateCamera(cameraId, projectId, updates) {
  const ref = doc(db, "cameras", cameraId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const prev = snap.data();

  await updateDoc(ref, {
    updatedAt: serverTimestamp(),
  });

  if (
    updates.location &&
    (updates.location.lat !== prev.location?.lat ||
      updates.location.lng !== prev.location?.lng)
  ) {
    await createOperation(cameraId, projectId, "relocation");

    await addLocation({
      cameraId,
      projectId,
      lat: updates.location.lat,
      lng: updates.location.lng,
      originOperation: "relocation",
    });
  }
}

export async function placeCamera(cameraId, projectId) {
  await createOperation(cameraId, projectId, "placement");

  const snap = await getDoc(doc(db, "cameras", cameraId));
  const loc = snap.data().location;

  if (loc?.lat != null && loc?.lng != null) {
    await addLocation({
      cameraId,
      projectId,
      lat: loc.lat,
      lng: loc.lng,
      originOperation: "placement",
    });
  }
}

export async function removeCamera(cameraId, projectId) {
  await createOperation(cameraId, projectId, "removal");
}
