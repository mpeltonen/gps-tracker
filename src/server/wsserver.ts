import { appRouter } from "./trpc/routers";
import ws from "ws";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { Server } from "http";
import EventEmitter from "events";

export const startWsServer = (server: Server, ee: EventEmitter) => {
  const wss = new ws.Server({
    server,
  });

  const wsHandler = applyWSSHandler({ wss, router: appRouter(ee), createContext: () => ({}) });

  wss.on("connection", (ws) => {
    console.log(`Opened WebSocket connection (${wss.clients.size})`);
    ws.once("close", () => {
      console.log(`Closed WebSocket connection (${wss.clients.size})`);
    });
  });

  const wssAddress = wss.address();
  console.log(
    `WebSocket Server listening on ws://${typeof wssAddress === "string" ? wssAddress : `${wssAddress.address}:${wssAddress.port}`}`
  );

  process.on("SIGTERM", () => {
    console.log("SIGTERM");
    wsHandler.broadcastReconnectNotification();
    wss.close();
  });
};
