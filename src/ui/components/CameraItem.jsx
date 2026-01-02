import { useContext, useState } from "react";
import { UIContext } from "../UIContext";

export function CameraItem({
  camera,
  operations,
  usersById,
  placeCamera,
  removeCamera,
  isSelected,
}) {
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
      <h4>Historial</h4>
      <ul>
        {visibleOperations.map((op) => (
          <li key={op.id}>
            <strong>{op.type}</strong> —{" "}
            {op.createdAt?.toDate().toLocaleString() || "…"}
            {op.statusAfter && <> — status: {op.statusAfter}</>}
            {op.type === "maintenance" && op.maintenanceType && (
              <> — maintenanceType: {op.maintenanceType}</>
            )}
            {op.userId && usersById?.[op.userId]?.displayName && (
              <> — por {usersById[op.userId].displayName}</>
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
