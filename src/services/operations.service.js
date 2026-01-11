import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import {
  assertCameraIsActive,
  assertNotRemoved,
} from "../domain/operationGuards";

export function listenToOperations(cameraId, onChange, onError) {
  const q = query(
    collection(db, "cameras", cameraId, "operations"),
    orderBy("clientCreatedAt", "desc"),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const ops = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      onChange(ops);
    },
    onError,
  );
}

export async function createOperation(cameraId, projectId, type, extra = {}) {
  const ref = collection(db, "cameras", cameraId, "operations");

  await addDoc(ref, {
    projectId,
    type,
    userId: auth.currentUser.uid,
    ...extra,
    clientCreatedAt: Date.now(),
    createdAt: serverTimestamp(),
  });
}

export async function createMaintenance(
  cameraId,
  projectId,
  maintenanceType,
  operations = [],
) {
  if (!["battery", "sd", "both"].includes(maintenanceType)) {
    throw new Error("maintenanceType inválido");
  }

  assertCameraIsActive(operations);
  assertNotRemoved(operations);

  return createOperation(cameraId, projectId, "maintenance", {
    maintenanceType,
  });
}
