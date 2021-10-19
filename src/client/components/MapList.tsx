import { ChangeEvent, FC } from "react";
import { EventMap } from "../../shared/schemas";
import { PrimitiveAtom, useAtom } from "jotai";
import { trpc } from "../utils/trpc";

interface Props {
  selectedMapAtom: PrimitiveAtom<EventMap | null>;
}

const MapList: FC<Props> = ({ selectedMapAtom }) => {
  const [, setSelectedMap] = useAtom(selectedMapAtom);

  const eventMaps = trpc.useQuery(["getMaps"]);

  const onSelectedMapChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (e) {
      setSelectedMap({ id: value });
    }
  };

  return (
    <select onChange={onSelectedMapChange} defaultValue="">
      <option value="">Select Map</option>
      {eventMaps.data &&
        eventMaps.data.map((m) => (
          <option key={m.id} value={m.id}>
            {m.id}
          </option>
        ))}
    </select>
  );
};

export default MapList;
