import { useContext, useState } from "react";
import { UIContext } from "../UIContext";

export function CameraItem({
  camera,
  operations,
  onUpdateCamera,
  placeCamera,
  removeCamera,
  isSelected,
}) {
  const [draftLocation, setDraftLocation] = useState(camera.location);
  const [isExpanded, setIsExpanded] = useState(false);
  const { setSelectedCameraId } = useContext(UIContext);

  const MAX_VISIBLE = 3;
  const visibleOperations = isExpanded
    ? operations
    : operations.slice(0, MAX_VISIBLE);

  return (
    <li
      style={{
        border: isSelected ? "2px solid #2563eb" : "1px solid #ddd",
        padding: "8px",
        marginBottom: "8px",
        borderRadius: "4px",
      }}
    >
      <strong
        onClick={() => setSelectedCameraId(camera.id)}
        style={{ cursor: "pointer" }}
      >
        {camera.id}
      </strong>
      {camera.derivedState === "inactive" && (
        <button onClick={() => placeCamera(camera.id)}>Colocar</button>
      )}
      {camera.derivedState === "active" && (
        <button onClick={() => removeCamera(camera.id)}>Retirar</button>
      )}
      <br />
      <input
        type="number"
        step="any"
        value={draftLocation?.lat ?? ""}
        onChange={(e) =>
          setDraftLocation({
            ...draftLocation,
            lat: e.target.value === "" ? null : Number(e.target.value),
          })
        }
      />
      <input
        type="number"
        step="any"
        value={draftLocation?.lng ?? ""}
        onChange={(e) =>
          setDraftLocation({
            ...draftLocation,
            lng: e.target.value === "" ? null : Number(e.target.value),
          })
        }
      />
      <button
        onClick={() =>
          onUpdateCamera(camera.id, {
            location: draftLocation,
          })
        }
      >
        Guardar ubicación
      </button>
      <h4>Historial</h4>
      <ul>
        {visibleOperations.map((op) => (
          <li key={op.id}>
            <strong>{op.type}</strong> —{" "}
            {op.createdAt?.toDate().toLocaleString() || "…"}
            {op.statusAfter && <> — status: {op.statusAfter}</>}
            {op.location && (
              <>
                {" "}
                — loc: {op.location.lat}, {op.location.lng}
              </>
            )}
          </li>
        ))}
      </ul>
      {operations.length > MAX_VISIBLE && (
        <button onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? "Ver menos" : "Ver más"}
        </button>
      )}
    </li>
  );
}
