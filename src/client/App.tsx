import { FC } from "react";
import styles from "./App.module.css";
import MapFileUpload from "./components/MapFileUpload";
import MapWrapper from "./components/MapWrapper";
import MapList from "./components/MapList";
import { atom } from "jotai";
import { EventMap } from "../shared/schemas";

const selectedMapAtom = atom<EventMap | null>(null);
const lastMapUploadTimeAtom = atom<number>(Date.now());

const App: FC = () => {
  return (
    <div className={styles.container}>
      <MapFileUpload lastMapUploadTimeAtom={lastMapUploadTimeAtom} />
      <MapList selectedMapAtom={selectedMapAtom} lastMapUploadTimeAtom={lastMapUploadTimeAtom} />
      <MapWrapper selectedMapAtom={selectedMapAtom} />
    </div>
  );
};

export default App;
