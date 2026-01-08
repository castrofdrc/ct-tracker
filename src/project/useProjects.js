import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase"; // ajustá el import si es distinto

export function useProjects(user) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Asumiendo modelo: projects/{projectId}.members incluye uid
    const q = query(
      collection(db, "projects"),
      where("members", "array-contains", user.uid),
    );

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setProjects(list);
        setLoading(false);
      },
      (err) => {
        console.error("Error cargando proyectos", err);
        setProjects([]);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user]);

  return { projects, loading };
}
