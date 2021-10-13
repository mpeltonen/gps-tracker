import { FC } from "react";
import styles from "./App.module.css";
import MapFileUpload from "./components/MapFileUpload";

const App: FC = () => {
  return (
    <div className={styles.container}>
      <MapFileUpload />
    </div>
  );
};

export default App;
