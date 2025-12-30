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
    location: { lat: null, lng: null },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await createOperation(cameraId, projectId, "deploy", {
    statusAfter: "inactive",
  });
}

export async function updateCamera(cameraId, updates) {
  const ref = doc(db, "cameras", cameraId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const prev = snap.data();

  await updateDoc(ref, {
    ...updates,
    updatedAt: serverTimestamp(),
  });

  if (updates.status && updates.status !== prev.status) {
    await createOperation(cameraId, prev.projectId, "status_change", {
      statusAfter: updates.status,
    });
  }

  if (
    updates.location &&
    (updates.location.lat !== prev.location?.lat ||
      updates.location.lng !== prev.location?.lng)
  ) {
    await createOperation(cameraId, prev.projectId, "relocate", {
      location: updates.location,
    });
  }
}
