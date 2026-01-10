import { useContext, useState } from "react";
import { UIContext } from "../UIContext";
import { ProjectContext } from "../../project/ProjectContext";

export function NewCameraScreen() {
  const ui = useContext(UIContext);
  const project = useContext(ProjectContext);
  const [cameraId, setCameraId] = useState("");

  const create = async () => {
    if (!navigator.onLine) {
      alert("Para crear una cámara necesitás conexión.");
      return;
    }

    if (!/^CT_\d{3}$/.test(cameraId)) {
      alert("Formato inválido. Usar CT_XXX (ej: CT_005)");
      return;
    }

    try {
      await project.createCamera(cameraId);
      setCameraId("");
      ui.goTo("main");
    } catch (err) {
      alert("No se pudo crear la cámara.");
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, padding: "15%" }}>
      <button onClick={() => ui.goTo("main")}>← Nueva cámara</button>

      <div style={{ marginTop: 40 }}>
        <input
          placeholder="CT_001"
          value={cameraId}
          onChange={(e) => setCameraId(e.target.value)}
          style={{ width: "100%", height: 44 }}
        />

        <button
          onClick={create}
          style={{ width: "100%", height: 44, marginTop: 16 }}
        >
          Crear cámara
        </button>
      </div>
    </div>
  );
}
