import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export function listenToUserProjects(userId, onChange, onError) {
  const q = query(
    collection(db, "projects"),
    where("members", "array-contains", userId),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const projects = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      onChange(projects);
    },
    onError,
  );
}
