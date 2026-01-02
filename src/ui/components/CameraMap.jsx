import { useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { UIContext } from "../UIContext";
import { FitBounds } from "./FitBounds";
import { MapClickHandler } from "./MapClickHandler";
import { CenterOnCamera } from "./CenterOnCamera";

const DEFAULT_CENTER = [-34.6, -58.4];
const DEFAULT_ZOOM = 6;

export function CameraMap({ cameras, onRelocate }) {
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
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {camerasWithLocation.length > 1 && (
        <FitBounds cameras={camerasWithLocation} />
      )}

      {selectedCamera &&
        selectedCamera.location &&
        camerasWithLocation.length <= 1 && (
          <CenterOnCamera camera={selectedCamera} />
        )}

      <MapClickHandler onRelocate={onRelocate} />

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
            Estado: {camera.derivedState}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
