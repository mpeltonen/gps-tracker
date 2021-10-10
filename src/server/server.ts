import express, { Express, Request, Response } from "express";
import { EchoRequestSchema } from "../shared/schemas";
import helmet from "helmet";
import path from "path";

const PORT = process.env.PORT || 3001;
const app = express();
app.disable("x-powered-by");

if (process.env.NODE_ENV === "production") {
  serveClient(app);
}

app.use(helmet());
app.use(express.json());

app.post("/api/v1/echo", ({ body }: Request, res: Response) => {
  const parsed = EchoRequestSchema.safeParse(body);
  if (parsed.success) {
    res.status(200).json(parsed.data).end();
  } else {
    res.status(400).end();
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

function serveClient(app: Express) {
  const clientBuildDir = path.join(process.cwd() + "/build/client");
  app.use(express.static(clientBuildDir));
  app.get("/*", function (req, res) {
    res.sendFile(path.join(clientBuildDir, "index.html"));
  });
}
