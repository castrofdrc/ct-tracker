import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const DEFAULT_PROJECT_ID = "proj_1";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setActiveProjectId(DEFAULT_PROJECT_ID);
      } else {
        setUser(null);
        setActiveProjectId(null);
      }

      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  return {
    user,
    activeProjectId,
    authLoading,
    login,
  };
}
