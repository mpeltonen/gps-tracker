import { z } from "zod";

export const EchoRequestSchema = z.object({
  message: z.string(),
});

export type EchoRequestBody = z.infer<typeof EchoRequestSchema>;

export const MapUploadResponseSchema = z.union([
  z.object({ name: z.string() }),
  z.object({
    error: z.string().optional(),
  }),
]);

export type MapUploadResponse = z.infer<typeof MapUploadResponseSchema>;
