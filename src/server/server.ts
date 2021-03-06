import express from "express";
import helmet from "helmet";
import path from "path";
import { genericErrorHandler, multerErrorHandler } from "./handlers/errors";
import { mapsPostHandlers, traccarPostHandler } from "./handlers/maps/post";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter, createTRPCContext } from "./trpc/routers";
import { mapGetHandler } from "./handlers/maps/get";
import { start as startTeltonikaTcpServer } from "./gpstracker/teltonika";
import EventEmitter from "events";
import { startWsServer } from "./wsserver";

const PORT = process.env.PORT || 3001;
const app = express();
const ee = new EventEmitter();

app.disable("x-powered-by");

app.use(helmet());
app.use(express.json());
app.use("/trpc", trpcExpress.createExpressMiddleware({ router: appRouter(ee), createContext: createTRPCContext }));

app.post("/api/v1/maps", mapsPostHandlers);
app.get("/api/v1/maps/:fileName", mapGetHandler);

app.post("/traccar", traccarPostHandler(ee));

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

const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

startWsServer(server, ee);
startTeltonikaTcpServer(ee);
