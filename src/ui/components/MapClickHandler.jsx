import { useMapEvents } from "react-leaflet";

export function MapClickHandler({ onRelocate }) {
  useMapEvents({
    click(e) {
      if (!onRelocate) return;
      onRelocate(null, e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}
