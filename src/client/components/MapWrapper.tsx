import { MapContainer, TileLayer } from "react-leaflet";
import { FC } from "react";
import styles from "./MapWrapper.module.css";
import { LatLngTuple } from "leaflet";
import { EventMap } from "../../shared/schemas";
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
  const mapBounds: LatLngTuple[] | undefined = metaData
    ? [
        [metaData.latLonBox.north, metaData.latLonBox.west],
        [metaData.latLonBox.south, metaData.latLonBox.east],
      ]
    : undefined;

  return (
    <>
      <MapContainer className={styles.mapContainer} center={mapCenter} zoom={11}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {selectedMap && mapBounds && <DistortableImageOverlay mapId={selectedMap.id} mapMetadata={metaData} mapCenter={mapCenter} />}
      </MapContainer>
    </>
  );
};

export default MapWrapper;
