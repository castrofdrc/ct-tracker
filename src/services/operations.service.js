import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export function listenToOperations(cameraId, onChange, onError) {
  const q = query(
    collection(db, "cameras", cameraId, "operations"),
    orderBy("createdAt", "desc"),
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
    ...extra,
    createdAt: serverTimestamp(),
  });
}
