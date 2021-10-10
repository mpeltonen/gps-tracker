import React, { FC, useEffect, useState } from "react";
import styles from "./App.module.css";
import { echo } from "./apiClient";

const App: FC = () => {
  const [echoResponse, setEchoResponse] = useState("");

  useEffect(() => {
    echo({ message: "echo message" }).then(setEchoResponse);
  }, []);

  return (
    <div className={styles.container}>
      <pre>{JSON.stringify(echoResponse)}</pre>
    </div>
  );
};

export default App;
