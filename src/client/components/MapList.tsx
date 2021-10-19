import { ChangeEvent, FC, useEffect } from "react";
import { EventMap } from "../../shared/schemas";
import { Atom, PrimitiveAtom } from "jotai";
import { useAtom } from "jotai";
import { trpc } from "../utils/trpc";
import { useQueryClient } from "react-query";

interface Props {
  selectedMapAtom: PrimitiveAtom<EventMap | null>;
  lastMapUploadTimeAtom: Atom<number>;
}

const MapList: FC<Props> = ({ selectedMapAtom, lastMapUploadTimeAtom }) => {
  const queryClient = useQueryClient();
  const [, setSelectedMap] = useAtom(selectedMapAtom);
  const [lastMapUploadTime] = useAtom(lastMapUploadTimeAtom);

  const eventMaps = trpc.useQuery(["getMaps"]);

  useEffect(() => {
    queryClient.invalidateQueries("getMaps");
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
