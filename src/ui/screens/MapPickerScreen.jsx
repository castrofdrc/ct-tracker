import { useContext, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { UIContext } from "../UIContext";
import { ProjectContext } from "../../project/ProjectContext";
import { MapClickHandler } from "../components/MapClickHandler";
import { FitBounds } from "../components/FitBounds";

const FALLBACK_CENTER = [-34.6, -58.4];
const FALLBACK_ZOOM = 6;

export function MapPickerScreen() {
  const ui = useContext(UIContext);
  const project = useContext(ProjectContext);
  const [picked, setPicked] = useState(null);

  const camerasWithLocation = project.cameras.filter(
    (c) =>
      c.derivedState === "active" &&
      c.location &&
      Number.isFinite(c.location.lat) &&
      Number.isFinite(c.location.lng),
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "#fff" }}>
      <div style={{ height: 48, display: "flex", alignItems: "center" }}>
        <button onClick={() => ui.goTo("newAction")} style={{ marginLeft: 12 }}>
          ←
        </button>
      </div>

      <div style={{ position: "fixed", inset: "48px 0 0 0" }}>
        <MapContainer
          style={{ height: "100%", width: "100%" }}
          whenCreated={(map) => {
            if (camerasWithLocation.length === 0) {
              map.setView(FALLBACK_CENTER, FALLBACK_ZOOM);
            }
          }}
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
            bottom: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => {
              ui.setPendingCameraState(picked);
              ui.setReturningFromMap(true);
              ui.goTo("newAction");
            }}
            style={{
              height: 48,
              borderRadius: 8,
              border: "1px solid #0A0A0A",
              fontSize: 14,
              textAlign: "left",
              padding: "0 20px",
              marginBottom: 10,
              backgroundColor: "#fff",
              color: "#0A0A0A",
            }}
          >
            Confirmar ubicación
          </button>
        </div>
      )}
    </div>
  );
}
