import * as trpc from "@trpc/server";
import { TRPCError } from "@trpc/server";
import fs from "fs";
import * as trpcExpress from "@trpc/server/adapters/express";
import { z } from "zod";
import EventEmitter from "events";
import { TrackerLocation } from "../../shared/schemas";

export const createTRPCContext = (ignored: trpcExpress.CreateExpressContextOptions) => ({});

type Context = trpc.inferAsyncReturnType<typeof createTRPCContext>;

const mapsPath = "uploads/maps";

const MapMetadataSchema = z.object({
  latLonBox: z.object({
    north: z.number(),
    east: z.number(),
    south: z.number(),
    west: z.number(),
    rotation: z.number(),
  }),
});

export const appRouter = (ee: EventEmitter) =>
  trpc
    .router<Context>()
    .query("getMap", {
      input: z.string().min(2),
      resolve(req) {
        const parsed = MapMetadataSchema.safeParse(JSON.parse(fs.readFileSync(`${mapsPath}/${req.input}.json`).toString()));
        if (parsed.success) {
          return parsed.data;
        } else {
          console.error(JSON.stringify(parsed.error.issues, null, 2));
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: parsed.error.message, cause: parsed.error.stack });
        }
      },
    })
    .query("getMaps", {
      async resolve(ignored) {
        const fileNames = fs.readdirSync(mapsPath);
        return fileNames.filter((fn) => fn.endsWith(".json")).map((fn) => ({ id: fn.split(".")[0] }));
      },
    })
    .subscription("onLocationUpdate", {
      resolve(ignored) {
        return new trpc.Subscription<TrackerLocation>((emit) => {
          const onTrackerLocationUpdate = (data: TrackerLocation) => emit.data(data);

          ee.on("trackerLocationUpdate", onTrackerLocationUpdate);

          return () => {
            ee.off("trackerLocationUpdate", onTrackerLocationUpdate);
          };
        });
      },
    });

export type AppRouter = ReturnType<typeof appRouter>;
