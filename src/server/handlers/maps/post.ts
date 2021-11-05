import multer from "multer";
import { NextFunction, Request, Response } from "express";
import fs from "fs";
import { MapUploadResponse, TrackerLocationSchema } from "../../../shared/schemas";
import * as unzipper from "unzipper";
import { parseStringPromise } from "xml2js";
import EventEmitter from "events";
import { z } from "zod";

const upload = multer({
  dest: "uploads",
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

const TraccarSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  lat: z.string(),
  lon: z.string(),
});

export const traccarPostHandler = (ee: EventEmitter) => (req: Request, res: Response) => {
  const traccarData = TraccarSchema.parse(req.query);
  const trackerLocation = TrackerLocationSchema.parse({
    trackerId: traccarData.id,
    ts: Number(traccarData.timestamp) * 1000,
    lat: Number(traccarData.lat),
    lon: Number(traccarData.lon),
  });
  console.log(
    `Location update from Traccar client ${traccarData.id}: Time: ${new Date(trackerLocation.ts).toLocaleString("fi")}, Latitude: ${
      traccarData.lat
    }, Longitude: ${traccarData.lon}`
  );
  ee.emit("trackerLocationUpdate", trackerLocation);
  res.status(201);
};

export const mapsPostHandlers = [
  upload.single("mapFile"),
  async (req: Request, res: Response, next: NextFunction) => {
    const { file: mapFile } = req;

    const errorResponse = (msg: string): MapUploadResponse => ({ error: msg });
    const okResponse = (fileName: string): MapUploadResponse => ({ id: fileName });

    try {
      if (!mapFile) {
        return res.status(400).json(errorResponse(`No file named 'mapFile'`));
      }
      await handleFile(mapFile);
      res.json(okResponse(mapFile.originalname));
    } catch (err: unknown) {
      next(err);
    } finally {
      if (mapFile?.path) {
        fs.unlinkSync(mapFile.path);
      }
    }
  },
];

const handleFile = async (mapFile: Express.Multer.File) => {
  const unzipDir = `uploads/maps`;
  if (!fs.existsSync(unzipDir)) {
    fs.mkdirSync(unzipDir, { recursive: true });
  }
  console.log(`Unzipping map file to ${unzipDir}...`);
  await fs
    .createReadStream(mapFile.path)
    .pipe(unzipper.Parse())
    .on("entry", async (entry) => {
      const fileName = entry.path;
      console.log(`Processing ${fileName}`);
      if (fileName === "files/tile_0_0.jpg") {
        entry.pipe(fs.createWriteStream(`${unzipDir}/${mapFile.filename}.jpg`));
      } else if (fileName === "doc.kml") {
        const metadata = await transformKmlToJsonMetadata(await entry.buffer());
        await fs.writeFileSync(`${unzipDir}/${mapFile.filename}.json`, JSON.stringify(metadata, null, 2));
        entry.autodrain();
      } else {
        entry.autodrain();
      }
    })
    .promise();
  console.log(`Done.`);
};

const transformKmlToJsonMetadata = async (kmlAsStr: string) => {
  const kmlAsJson = await parseStringPromise(kmlAsStr);
  const groundOverlay = kmlAsJson?.kml?.Folder?.[0]?.GroundOverlay;
  if (!groundOverlay) {
    throw Error(`No GroundOverlay found`);
  }
  const latLonBox = groundOverlay[0]?.LatLonBox?.[0];
  if (!latLonBox) {
    throw Error(`No LatLonBox found`);
  }
  return {
    latLonBox: {
      north: parseFloat(latLonBox.north[0]),
      south: parseFloat(latLonBox.south[0]),
      east: parseFloat(latLonBox.east[0]),
      west: parseFloat(latLonBox.west[0]),
      rotation: parseFloat(latLonBox.rotation[0]),
    },
  };
};
