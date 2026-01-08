export function CameraItem({
  camera,
  operations,
  usersById,
  placeCamera,
  removeCamera,
  isSelected,
}) {
  const isActive = camera.derivedState === "active";
  const canPlace = !isActive;
  const primaryLabel = canPlace ? "Colocar" : "Retirar";

  const handlePrimary = () => {
    if (canPlace) {
      placeCamera(camera.id);
    } else {
      removeCamera(camera.id);
    }
  };

  return (
    <li
      style={{
        listStyle: "none",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        padding: "12px",
        marginBottom: "10px",
        background: isSelected ? "#f9fafb" : "#ffffff",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <strong>{camera.id}</strong>
        <span
          style={{
            fontSize: "0.8em",
            padding: "2px 8px",
            borderRadius: "999px",
            background: isActive ? "#d1fae5" : "#fee2e2",
          }}
        >
          {camera.derivedState}
        </span>
      </div>

      {/* PRIMARY ACTION */}
      <button
        onClick={handlePrimary}
        style={{
          width: "100%",
          minHeight: "44px",
          fontWeight: 600,
          background: canPlace ? "#2563eb" : "#dc2626",
          color: "#ffffff",
          borderRadius: "8px",
          border: "none",
          marginBottom: "8px",
        }}
      >
        {primaryLabel}
      </button>

      {/* SECONDARY / DETAIL */}
      <details>
        <summary
          style={{
            cursor: "pointer",
            fontSize: "0.9em",
            color: "#374151",
          }}
        >
          Ver detalle
        </summary>

        {/* LOCATION */}
        {camera.location && (
          <div style={{ marginTop: "6px", fontSize: "0.85em" }}>
            Ubicación: {camera.location.lat.toFixed(5)},{" "}
            {camera.location.lng.toFixed(5)}
          </div>
        )}

        {/* HISTORY */}
        <div style={{ marginTop: "6px" }}>
          <strong style={{ fontSize: "0.85em" }}>Historial</strong>
          <ul style={{ paddingLeft: "16px", fontSize: "0.85em" }}>
            {operations.map((op) => (
              <li key={op.id}>
                {op.type} — {usersById[op.userId]?.name || op.userId || "?"}
              </li>
            ))}
          </ul>
        </div>
      </details>
    </li>
  );
}
