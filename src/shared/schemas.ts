import { z } from "zod";

export const EchoRequestSchema = z.object({
  message: z.string(),
});

export type EchoRequestBody = z.infer<typeof EchoRequestSchema>;
