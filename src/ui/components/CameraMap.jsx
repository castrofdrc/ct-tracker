import { useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { UIContext } from "../UIContext";
import { FitBounds } from "./FitBounds";
import { MapClickHandler } from "./MapClickHandler";

export function CameraMap({ cameras, onRelocate }) {
  const { setSelectedCameraId } = useContext(UIContext);

  const camerasWithLocation = cameras.filter(
    (c) =>
      typeof c.location?.lat === "number" &&
      typeof c.location?.lng === "number",
  );

  if (camerasWithLocation.length === 0) {
    return <p>No hay cámaras con ubicación</p>;
  }

  return (
    <MapContainer style={{ height: "400px", width: "100%" }}>
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitBounds cameras={camerasWithLocation} />
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
