import { useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { UIContext } from "../UIContext";
import { FitBounds } from "./FitBounds";
import { CenterOnCamera } from "./CenterOnCamera";

const DEFAULT_CENTER = [-34.6, -58.4];
const DEFAULT_ZOOM = 6;

export function CameraMap({ cameras }) {
  const { setSelectedCameraId, selectedCameraId } = useContext(UIContext);

  const selectedCamera = cameras.find((c) => c.id === selectedCameraId);

  const camerasWithLocation = cameras.filter(
    (c) =>
      c.derivedState === "active" &&
      c.location &&
      Number.isFinite(c.location.lat) &&
      Number.isFinite(c.location.lng),
  );

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {camerasWithLocation.length === 0 && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            padding: 20,
            background: "rgba(255,255,255,0.9)",
            borderRadius: 8,
            zIndex: 1000,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            No hay cámaras activas
          </div>
          <div style={{ fontSize: 14, opacity: 0.6 }}>
            Las cámaras aparecerán aquí después de ser colocadas
          </div>
        </div>
      )}

      {camerasWithLocation.length > 1 && (
        <FitBounds cameras={camerasWithLocation} />
      )}

      {selectedCamera &&
        selectedCamera.location &&
        camerasWithLocation.length <= 1 && (
          <CenterOnCamera camera={selectedCamera} />
        )}

      {camerasWithLocation.map((camera) => (
        <Marker
          key={camera.id}
          position={[camera.location.lat, camera.location.lng]}
          eventHandlers={{
            click: () => setSelectedCameraId(camera.id),
          }}
        >
          <Popup>
            <strong>{camera.id}</strong>
            <br />
            Ubicación:
            <br />
            {camera.location.lat.toFixed(6)}
            <br />
            {camera.location.lng.toFixed(6)}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
