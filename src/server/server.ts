import express from "express";
import helmet from "helmet";
import path from "path";
import { genericErrorHandler, multerErrorHandler } from "./handlers/errors";
import { mapsPostHandlers } from "./handlers/maps/post";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter, createTRPCContext } from "./trpc/routers";
import { mapGetHandler } from "./handlers/maps/get";
import { start as startTeltonika } from "./gpstracker/teltonika";

const PORT = process.env.PORT || 3001;
const app = express();
app.disable("x-powered-by");

app.use(helmet());
app.use(express.json());
app.use("/trpc", trpcExpress.createExpressMiddleware({ router: appRouter, createContext: createTRPCContext }));

app.post("/api/v1/maps", mapsPostHandlers);
app.get("/api/v1/maps/:fileName", mapGetHandler);

if (process.env.NODE_ENV === "production") {
  // In dev mode, this part is served by CRA dev server
  const clientBuildDir = path.join(process.cwd() + "/build/client");
  app.use(express.static(clientBuildDir));
  app.get("/*", function (Ignored, res) {
    res.sendFile(path.join(clientBuildDir, "index.html"));
  });
}

app.use(multerErrorHandler);
app.use(genericErrorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

startTeltonika();
