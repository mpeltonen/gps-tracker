import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { FC, useState } from "react";
import styles from "./MapWrapper.module.css";
import { DivIcon, LatLngTuple } from "leaflet";
import { EventMap, TrackerLocation } from "../../shared/schemas";
import { Atom, useAtom } from "jotai";
import { trpc } from "../utils/trpc";
import DistortableImageOverlay from "./DistortableImageOverlay";

interface Props {
  selectedMapAtom: Atom<EventMap | null>;
}

type TrackerLocations = Record<string, TrackerLocation>;

const locationMarkerIconHtml = (label: string, cssColor: string) =>
  `<div class="${styles.divIconHtml}" style="background-color: ${cssColor};"><div class="${styles.divIconHtmlLabel}">${label}</div></div>`;

const MapWrapper: FC<Props> = ({ selectedMapAtom }) => {
  const [selectedMap] = useAtom(selectedMapAtom);
  const mapCenter: LatLngTuple = [62.79, 22.85];
  const selectedMapMetadata = trpc.useQuery(["getMap", selectedMap?.id || ""], { enabled: selectedMap !== null });
  const metaData = selectedMapMetadata.isSuccess ? selectedMapMetadata.data : undefined;

  const [trackerLocations, setTrackerLocations] = useState<TrackerLocations>();

  trpc.useSubscription(["onLocationUpdate"], {
    onNext(location: TrackerLocation) {
      setTrackerLocations((prev) => {
        return Object.assign({}, prev, { [location.trackerId]: location });
      });
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
        {trackerLocations &&
          Object.values(trackerLocations).map((tl) => (
            <Marker
              key={tl.trackerId}
              icon={
                new DivIcon({
                  className: styles.divIcon,
                  html: locationMarkerIconHtml(tl.trackerId, "red"),
                })
              }
              position={[tl.lat, tl.lon]}
            >
              <Popup>{new Date(tl.ts).toLocaleString()}</Popup>
            </Marker>
          ))}
      </MapContainer>
    </>
  );
};

export default MapWrapper;
