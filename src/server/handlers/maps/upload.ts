import multer from "multer";
import { NextFunction, Request, Response } from "express";
import fs from "fs";
import { MapUploadResponse } from "../../../shared/schemas";
import * as unzipper from "unzipper";
import { parseStringPromise } from "xml2js";

const upload = multer({
  dest: "uploads",
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export const mapUploadHandlers = [
  upload.single("mapFile"),
  async (req: Request, res: Response, next: NextFunction) => {
    const { file: mapFile } = req;

    const errorResponse = (msg: string): MapUploadResponse => ({ error: msg });
    const okResponse = (fileName: string): MapUploadResponse => ({ name: fileName });

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
        const metadata = transformKmlToJsonMetadata(await entry.buffer());
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
