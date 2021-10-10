import { EchoRequestBody } from "../shared/schemas";

const jsonPost = (body: Record<string, any>) => ({
  method: "POST",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});

export const echo = async (body: EchoRequestBody) => {
  const response = await fetch("/api/v1/echo", jsonPost(body));
  return await response.json();
};
