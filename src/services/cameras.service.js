import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { createOperation } from "./operations.service";
import { addLocation } from "./locations.service";
import {
  assertHasBeenPlaced,
  assertNotRemoved,
} from "../domain/operationGuards";

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

export async function relocateCamera(
  cameraId,
  projectId,
  lat,
  lng,
  operations = [],
) {
  assertHasBeenPlaced(operations);
  assertNotRemoved(operations);

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
}

export async function removeCamera(cameraId, projectId) {
  await createOperation(cameraId, projectId, "removal");
}
