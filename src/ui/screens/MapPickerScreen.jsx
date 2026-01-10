import { useContext, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { UIContext } from "../UIContext";
import { ProjectContext } from "../../project/ProjectContext";
import { FitBounds } from "../components/FitBounds";
import { MapClickHandler } from "../components/MapClickHandler";

const FALLBACK_CENTER = [-34.6, -58.4];
const FALLBACK_ZOOM = 6;

export function MapPickerScreen() {
  const ui = useContext(UIContext);
  const project = useContext(ProjectContext);
  const [picked, setPicked] = useState(null);
  console.log("CAMERAS:", project.cameras);

  const camerasWithLocation = project.cameras.filter(
    (c) =>
      c.location &&
      Number.isFinite(c.location.lat) &&
      Number.isFinite(c.location.lng),
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "#fff" }}>
      <div style={{ height: 56, display: "flex", alignItems: "center" }}>
        <button
          onClick={() => ui.goTo("newAction")}
          style={{ fontSize: 16, fontWeight: 600, marginLeft: 12 }}
        >
          ← Elegir ubicación
        </button>
      </div>

      <div style={{ position: "fixed", inset: "56px 0 0 0" }}>
        <MapContainer
          center={FALLBACK_CENTER}
          zoom={FALLBACK_ZOOM}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {camerasWithLocation.length > 0 && (
            <FitBounds cameras={camerasWithLocation} />
          )}

          <MapClickHandler
            onRelocate={(_, lat, lng) => {
              setPicked({ lat, lng });
            }}
          />

          {picked && <Marker position={[picked.lat, picked.lng]} />}
        </MapContainer>
      </div>

      {picked && (
        <div
          style={{
            position: "fixed",
            left: 12,
            right: 12,
            bottom: "calc(12px + env(safe-area-inset-bottom))",
            background: "#fff",
            border: "1px solid #000",
            borderRadius: 12,
            padding: 12,
          }}
        >
          <button
            onClick={() => {
              ui.setPendingCameraState({
                lat: picked.lat,
                lng: picked.lng,
              });
              ui.goTo("newAction");
            }}
            style={{
              width: "100%",
              height: 44,
              borderRadius: 8,
              border: "1px solid #000",
              background: "#fff",
              fontWeight: 600,
            }}
          >
            Confirmar ubicación
          </button>
        </div>
      )}
    </div>
  );
}
