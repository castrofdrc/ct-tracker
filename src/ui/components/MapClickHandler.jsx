import { useContext } from "react";
import { useMapEvents } from "react-leaflet";
import { UIContext } from "../UIContext";

export function MapClickHandler({ onRelocate }) {
  const { selectedCameraId } = useContext(UIContext);

  useMapEvents({
    click(e) {
      if (!selectedCameraId) return;

      onRelocate(selectedCameraId, e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}
