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
