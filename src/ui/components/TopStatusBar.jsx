import { useNetworkStatus } from "../useNetworkStatus";

export function TopStatusBar({ projectId }) {
  const isOnline = useNetworkStatus();
  const coords = "-34.563773, -54.706666";

  return (
    <>
      <div
        style={{
          position: "fixed",
          // CAMBIO CRÍTICO: Suma el área segura del notch
          top: "calc(8px + env(safe-area-inset-top))",
          left: 8,
          right: 8,
          height: 38,
          zIndex: 100,
          background: "#ffffff",
          borderRadius: "10px",
          border: "1px solid #000",
          padding: "0 12px",
          display: "flex",
          alignItems: "center",
          fontSize: "0.85em",
          fontFamily:
            "Roboto, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
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
            fontWeight: "bold",
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
