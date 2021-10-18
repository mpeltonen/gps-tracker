import { MapContainer, TileLayer } from "react-leaflet";
import { FC } from "react";
import styles from "./MapWrapper.module.css";
import { LatLngTuple } from "leaflet";
import { EventMap } from "../../shared/schemas";
import { Atom, useAtom } from "jotai";

interface Props {
  selectedMapAtom: Atom<EventMap | null>;
}

const MapWrapper: FC<Props> = ({ selectedMapAtom }) => {
  const [selectedMap] = useAtom(selectedMapAtom);
  const mapCenter: LatLngTuple = [62.79, 22.85];

  return (
    <>
      <div>Selected event map: {selectedMap?.id}</div>
      <MapContainer className={styles.mapContainer} center={mapCenter} zoom={11} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </>
  );
};

export default MapWrapper;
