import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export function listenToUser(uid, onChange, onError) {
  const ref = doc(db, "users", uid);

  return onSnapshot(
    ref,
    (snap) => {
      if (!snap.exists()) {
        onChange(null);
        return;
      }
      onChange({ uid, ...snap.data() });
    },
    onError,
  );
}
