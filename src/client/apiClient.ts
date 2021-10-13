import { MapUploadResponse, MapUploadResponseSchema } from "../shared/schemas";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const jsonPost = (body: Record<string, never>) => ({
  method: "POST",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});

export const uploadMapFile = async (file: File): Promise<MapUploadResponse> => {
  const formData = new FormData();
  formData.append("mapFile", file);

  const response = await fetch("/api/v1/maps", { method: "POST", body: formData });
  const parsed = MapUploadResponseSchema.safeParse(await response.json());
  return parsed.success ? parsed.data : { error: parsed.error.message };
};
