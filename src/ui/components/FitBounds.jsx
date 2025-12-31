import { useContext, useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { UIContext } from "../UIContext";

export function FitBounds({ cameras }) {
  const map = useMap();
  const { selectedCameraId } = useContext(UIContext);

  useEffect(() => {
    if (selectedCameraId) {
      const cam = cameras.find((c) => c.id === selectedCameraId);
      if (cam) {
        map.setView(
          [cam.location.lat, cam.location.lng],
          Math.max(map.getZoom(), 15),
        );
        return;
      }
    }

    if (cameras.length > 0) {
      const bounds = L.latLngBounds(
        cameras.map((c) => [c.location.lat, c.location.lng]),
      );
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [cameras, selectedCameraId, map]);

  return null;
}
