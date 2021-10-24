import { z } from "zod";

export const EventMapSchema = z.object({
  id: z.string(),
});

export type EventMap = z.infer<typeof EventMapSchema>;

export const MapUploadResponseSchema = z.union([
  EventMapSchema,
  z.object({
    error: z.string().optional(),
  }),
]);

export type MapUploadResponse = z.infer<typeof MapUploadResponseSchema>;

export const TrackerLocationSchema = z.object({
  ts: z.number(),
  lat: z.number(),
  lon: z.number(),
  trackerId: z.string(),
});

export type TrackerLocation = z.infer<typeof TrackerLocationSchema>;
