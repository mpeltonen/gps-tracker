import { ChangeEvent, FC, useEffect, useState } from "react";
import { EventMap } from "../../shared/schemas";
import { Atom, PrimitiveAtom } from "jotai";
import { useAtom } from "jotai";

interface Props {
  selectedMapAtom: PrimitiveAtom<EventMap | null>;
  lastMapUploadTimeAtom: Atom<number>;
}

const MapList: FC<Props> = ({ selectedMapAtom, lastMapUploadTimeAtom }) => {
  const [eventMaps, setEventMaps] = useState<EventMap[]>([]);
  const [, setSelectedMap] = useAtom(selectedMapAtom);
  const [lastMapUploadTime] = useAtom(lastMapUploadTimeAtom);

  useEffect(() => {
    (async function fetchData() {
      setEventMaps(await (await fetch("/api/v1/maps")).json());
    })();
  }, [lastMapUploadTime]);

  const onSelectedMapChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (e) {
      setSelectedMap({ id: value });
    }
  };

  return (
    <select onChange={onSelectedMapChange} defaultValue="">
      <option value="">Select Map</option>
      {eventMaps.map((m) => (
        <option key={m.id} value={m.id}>
          {m.id}
        </option>
      ))}
    </select>
  );
};

export default MapList;
