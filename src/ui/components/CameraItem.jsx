import { useContext, useState } from "react";
import { UIContext } from "../UIContext";

export function CameraItem({
  camera,
  operations,
  locations,
  usersById,
  placeCamera,
  removeCamera,
  isSelected,
}) {
  const [isExpandedOps, setIsExpandedOps] = useState(false);
  const [isExpandedLocations, setIsExpandedLocations] = useState(false);
  const { setSelectedCameraId } = useContext(UIContext);
  const [showDetail, setShowDetail] = useState(false);

  const MAX_VISIBLE = 3;

  const visibleOperations = isExpandedOps
    ? operations
    : operations.slice(0, MAX_VISIBLE);

  const visibleLocations = isExpandedLocations
    ? locations
    : locations.slice(0, MAX_VISIBLE);

  return (
    <li
      style={{
        opacity: camera.derivedState === "inactive" ? 0.6 : 1,
        border: isSelected ? "2px solid #2563eb" : "1px solid #ddd",
        padding: "8px",
        marginBottom: "8px",
        borderRadius: "4px",
      }}
    >
      {/* HEADER OPERATIVO */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        {/* Fila superior: ID + acciones */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
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
        </div>

        {/* Ubicación actual (solo si active) */}
        {camera.derivedState === "active" && camera.location && (
          <div
            style={{
              padding: "4px 6px",
              background: "#ecfeff",
              border: "1px solid #67e8f9",
              borderRadius: "4px",
              fontSize: "0.85em",
              width: "fit-content",
            }}
          >
            📍 Ubicación: {camera.location.lat}, {camera.location.lng}
          </div>
        )}
      </div>

      <br />

      <button
        onClick={() => setShowDetail(!showDetail)}
        style={{ marginBottom: "8px", fontSize: "0.9em" }}
      >
        {showDetail ? "Ocultar detalle" : "Ver detalle"}
      </button>

      {showDetail && (
        <>
          <h4>Historial de operaciones</h4>
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
            <button onClick={() => setIsExpandedOps(!isExpandedOps)}>
              {isExpandedOps ? "Ver menos" : "Ver más"}
            </button>
          )}

          <h4>Historial de ubicaciones</h4>

          {(!locations || locations.length === 0) && (
            <p>Sin ubicaciones registradas.</p>
          )}

          {locations && locations.length > 0 && (
            <>
              <ul>
                {visibleLocations.map((loc) => (
                  <li key={loc.id}>
                    {loc.createdAt?.toDate().toLocaleString() || "…"}
                    {" — "}
                    {loc.lat}, {loc.lng}
                  </li>
                ))}
              </ul>

              {locations.length > MAX_VISIBLE && (
                <button
                  onClick={() => setIsExpandedLocations(!isExpandedLocations)}
                >
                  {isExpandedLocations ? "Ver menos" : "Ver más"}
                </button>
              )}
            </>
          )}
        </>
      )}
    </li>
  );
}
