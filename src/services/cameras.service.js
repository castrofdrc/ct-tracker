import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  getDocs,
  writeBatch,
  deleteDoc,
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

export async function relocateCamera(cameraId, projectId, lat, lng) {
  await createOperation(cameraId, projectId, "relocation");

  await addLocation({
    cameraId,
    projectId,
    lat,
    lng,
    originOperation: "relocation",
  });
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

export async function deleteCameraHard(cameraId) {
  const batch = writeBatch(db);

  const cameraRef = doc(db, "cameras", cameraId);

  // operations
  const opsSnap = await getDocs(
    collection(db, "cameras", cameraId, "operations"),
  );
  opsSnap.forEach((d) => batch.delete(d.ref));

  // locations
  const locSnap = await getDocs(
    collection(db, "cameras", cameraId, "locations"),
  );
  locSnap.forEach((d) => batch.delete(d.ref));

  // camera doc
  batch.delete(cameraRef);

  await batch.commit();
}
