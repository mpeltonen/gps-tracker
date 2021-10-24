import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { FC, useState } from "react";
import styles from "./MapWrapper.module.css";
import { LatLngTuple } from "leaflet";
import { EventMap, TrackerLocation } from "../../shared/schemas";
import { Atom, useAtom } from "jotai";
import { trpc } from "../utils/trpc";
import DistortableImageOverlay from "./DistortableImageOverlay";

interface Props {
  selectedMapAtom: Atom<EventMap | null>;
}

const MapWrapper: FC<Props> = ({ selectedMapAtom }) => {
  const [selectedMap] = useAtom(selectedMapAtom);
  const mapCenter: LatLngTuple = [62.79, 22.85];
  const selectedMapMetadata = trpc.useQuery(["getMap", selectedMap?.id || ""], { enabled: selectedMap !== null });
  const metaData = selectedMapMetadata.isSuccess ? selectedMapMetadata.data : undefined;

  const [trackerLocation, setTrackerLocation] = useState<TrackerLocation>();

  trpc.useSubscription(["onLocationUpdate"], {
    onNext(location: TrackerLocation) {
      console.log("Received", location);
      setTrackerLocation(location);
    },
    onError(err) {
      console.error(err);
    },
  });

  return (
    <>
      <MapContainer className={styles.mapContainer} center={mapCenter} zoom={11}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {selectedMap && metaData && <DistortableImageOverlay mapId={selectedMap.id} mapMetadata={metaData} mapCenter={mapCenter} />}
        {trackerLocation && (
          <Marker position={[trackerLocation.lat, trackerLocation.lon]}>
            <Popup>
              {trackerLocation.trackerId}: {new Date(trackerLocation.ts).toLocaleString()}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </>
  );
};

export default MapWrapper;
