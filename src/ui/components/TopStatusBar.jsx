import { useNetworkStatus } from "../useNetworkStatus";

export function TopStatusBar({ projectId }) {
  const isOnline = useNetworkStatus();
  const coords = "-34.563773, -54.706666";

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: "calc(8px + env(safe-area-inset-top))",
          left: 8,
          right: 8,
          height: 32,
          zIndex: 100,

          // Effecto blur
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          // Effecto blur

          borderRadius: "6px",
          border: "1px solid #0a0a0a",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          fontSize: "0.85em",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
          }}
        >
          <span>{coords}</span>
          <strong>{projectId}</strong>
        </div>
      </div>

      {!isOnline && (
        <div
          style={{
            position: "fixed",
            // CAMBIO: Ajuste dinámico para que baje según el notch también
            top: "calc(8px + 44px + 6px + env(safe-area-inset-top))",
            left: 12,
            right: 12,
            zIndex: 99,
            fontWeight: 600,
            color: "#dc2626",
            fontSize: "0.8em",
            textAlign: "center", // Mejor centrado en móvil
            textShadow: "0 0 2px white", // Legibilidad sobre mapa
          }}
        >
          Sin conexión, cambios pendientes
        </div>
      )}
    </>
  );
}
