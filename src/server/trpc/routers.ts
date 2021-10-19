import * as trpc from "@trpc/server";
import fs from "fs";
import * as trpcExpress from "@trpc/server/adapters/express";

export const createTRPCContext = (ignored: trpcExpress.CreateExpressContextOptions) => ({});

type Context = trpc.inferAsyncReturnType<typeof createTRPCContext>;

export const appRouter = trpc.router<Context>().query("getMaps", {
  async resolve(ignored) {
    const fileNames = fs.readdirSync("uploads/maps");
    return fileNames.filter((fn) => fn.endsWith(".json")).map((fn) => ({ id: fn.split(".")[0] }));
  },
});

export type AppRouter = typeof appRouter;
