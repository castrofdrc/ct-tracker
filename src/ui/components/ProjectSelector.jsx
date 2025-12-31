import { useEffect, useState, useContext } from "react";
import { listenToUserProjects } from "../../services/projects.service";
import { UIContext } from "../UIContext";

export function ProjectSelector({ user }) {
  const { setSelectedProjectId } = useContext(UIContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsub = listenToUserProjects(
      user.uid,
      (data) => {
        setProjects(data);
        setLoading(false);
      },
      () => setLoading(false),
    );

    return () => unsub();
  }, [user]);

  if (loading) return <p>Cargando proyectos…</p>;

  if (projects.length === 0) {
    return <p>No tenés acceso a ningún proyecto.</p>;
  }

  return (
    <div>
      <h2>Seleccionar proyecto</h2>
      <ul>
        {projects.map((p) => (
          <li key={p.id}>
            <button onClick={() => setSelectedProjectId(p.id)}>{p.id}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
