import React, { FC, useEffect, useState } from "react";
import styles from "./App.module.css";
import { echo } from "./apiClient";
import MapFileUpload from "./components/MapFileUpload";

const App: FC = () => {
  const [echoResponse, setEchoResponse] = useState("");

  useEffect(() => {
    echo({ message: "echo message" }).then(setEchoResponse);
  }, []);

  return (
    <div className={styles.container}>
      <pre>{JSON.stringify(echoResponse)}</pre>
      <MapFileUpload />
    </div>
  );
};

export default App;
