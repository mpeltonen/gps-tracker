import { MapUploadResponse, MapUploadResponseSchema } from "../shared/schemas";

const jsonPost = (body: Record<string, any>) => ({
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
  return parsed.success ? parsed.data : { error: "Error parsing response " };
};
