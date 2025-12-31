import { useContext } from "react";
import { useMapEvents } from "react-leaflet";
import { UIContext } from "../UIContext";

export function MapClickHandler({ onSetLocation }) {
  const { selectedCameraId } = useContext(UIContext);

  useMapEvents({
    click(e) {
      if (!selectedCameraId) return;

      onSetLocation(selectedCameraId, {
        location: {
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        },
      });
    },
  });

  return null;
}
