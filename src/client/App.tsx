import { FC, useState } from "react";
import styles from "./App.module.css";
import MapFileUpload from "./components/MapFileUpload";
import MapWrapper from "./components/MapWrapper";
import MapList from "./components/MapList";
import { atom } from "jotai";
import { EventMap } from "../shared/schemas";
import { trpc } from "./utils/trpc";
import { QueryClient, QueryClientProvider } from "react-query";

const selectedMapAtom = atom<EventMap | null>(null);

const App: FC = () => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      url: "/trpc",
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <div className={styles.container}>
          <MapFileUpload />
          <MapList selectedMapAtom={selectedMapAtom} />
          <MapWrapper selectedMapAtom={selectedMapAtom} />
        </div>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default App;
