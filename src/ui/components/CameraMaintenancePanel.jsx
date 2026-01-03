import { useContext, useState } from "react";
import { UIContext } from "../UIContext";
import { ProjectContext } from "../../project/ProjectContext";

export function CameraMaintenancePanel() {
  const { selectedCameraId } = useContext(UIContext);
  const project = useContext(ProjectContext);
  const [type, setType] = useState("");

  if (!selectedCameraId) return null;

  const applyMaintenance = () => {
    if (!type) {
      alert("Seleccioná un tipo de mantenimiento.");
      return;
    }

    try {
      project.maintenanceCamera(selectedCameraId, type);
      setType("");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div
      style={{ border: "1px solid #ccc", padding: "8px", marginTop: "12px" }}
    >
      <h3>Aplicar mantenimiento</h3>

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="">Seleccionar…</option>
        <option value="battery">Cambio de baterías</option>
        <option value="sd">Cambio de memoria</option>
        <option value="both">Baterías y memoria</option>
      </select>

      <button onClick={applyMaintenance}>Aplicar mantenimiento</button>
    </div>
  );
}
