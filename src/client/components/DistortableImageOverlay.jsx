import { useMap } from "react-leaflet";
import "leaflet-toolbar";
import "leaflet-distortableimage";
import { useEffect } from "react";

const DistortableImageOverlay = ({ mapId, mapMetadata, mapCenter }) => {
  const map = useMap();
  const { north, south, west, east, rotation } = mapMetadata.latLonBox;

  useEffect(() => {
    const layer = L.distortableImageOverlay(`/api/v1/maps/${mapId}.jpg`, {
      corners: [L.latLng(north, west), L.latLng(north, east), L.latLng(south, west), L.latLng(south, east)],
      rotation: {
        deg: -rotation,
      },
      mode: "lock",
    }).addTo(map);

    map.fitBounds([
      [north, west],
      [south, east],
    ]);
    // See https://github.com/publiclab/Leaflet.DistortableImage/issues/790 (concerns FireFox too)
    map.doubleClickZoom.disable();

    return () => {
      map.removeLayer(layer);
      map.setView(mapCenter);
    };
  }, [mapId]);

  return null;
};

export default DistortableImageOverlay;
