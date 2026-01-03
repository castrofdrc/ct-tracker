import { useContext, useEffect, useState } from "react";
import { UIContext } from "../UIContext";
import { ProjectContext } from "../../project/ProjectContext";

export function CameraRelocationPanel() {
  const { selectedCameraId } = useContext(UIContext);
  const project = useContext(ProjectContext);

  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  // Resetear inputs cuando cambia la cámara seleccionada
  useEffect(() => {
    setLat("");
    setLng("");
  }, [selectedCameraId]);

  if (!selectedCameraId) return null;

  const handleRelocate = () => {
    const latNum = Number(lat);
    const lngNum = Number(lng);

    if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) {
      alert("Latitud y longitud deben ser números válidos.");
      return;
    }

    try {
      project.relocateCamera(selectedCameraId, latNum, lngNum);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div
      style={{ border: "1px solid #ccc", padding: "8px", marginTop: "12px" }}
    >
      <h3>Relocalizar cámara</h3>

      <div>
        <label>
          Latitud:
          <input
            type="number"
            step="any"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Longitud:
          <input
            type="number"
            step="any"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
          />
        </label>
      </div>

      <button onClick={handleRelocate}>Aplicar relocalización</button>
    </div>
  );
}
