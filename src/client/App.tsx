import { FC } from "react";
import styles from "./App.module.css";
import MapFileUpload from "./components/MapFileUpload";
import MapWrapper from "./components/MapWrapper";
import MapSelector from "./components/MapSelector";
import { atom } from "jotai";
import { EventMap } from "../shared/schemas";
import { trpc } from "./utils/trpc";
import { QueryClient, QueryClientProvider } from "react-query";

const selectedMapAtom = atom<EventMap | null>(null);

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
  url: "/trpc",
});

const App: FC = () => {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <div className={styles.container}>
          <MapFileUpload />
          <MapSelector selectedMapAtom={selectedMapAtom} />
          <MapWrapper selectedMapAtom={selectedMapAtom} />
        </div>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default App;
