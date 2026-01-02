import { useEffect } from "react";
import { useMap } from "react-leaflet";

export function CenterOnCamera({ camera, zoom = 14 }) {
  const map = useMap();

  useEffect(() => {
    if (!camera?.location) return;

    const { lat, lng } = camera.location;

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    map.setView([lat, lng], zoom, { animate: true });
  }, [camera, map, zoom]);

  return null;
}
