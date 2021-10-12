import express, { Express } from "express";
import helmet from "helmet";
import path from "path";
import { genericErrorHandler, multerErrorHandler } from "./handlers/errors";
import { mapUploadHandlers } from "./handlers/maps/upload";

const PORT = process.env.PORT || 3001;
const app = express();
app.disable("x-powered-by");

if (process.env.NODE_ENV === "production") {
  serveClient(app);
}

app.use(helmet());
app.use(express.json());

app.post("/api/v1/maps", mapUploadHandlers);

app.use(multerErrorHandler);
app.use(genericErrorHandler);

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
