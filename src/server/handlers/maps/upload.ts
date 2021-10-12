import multer from "multer";
import { NextFunction, Request, Response } from "express";
import fs from "fs";
import { MapUploadResponse } from "../../../shared/schemas";

const upload = multer({
  dest: "uploads",
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export const mapUploadHandlers = [
  upload.single("mapFile"),
  (req: Request, res: Response, next: NextFunction) => {
    const { file: mapFile } = req;

    const errorResponse = (msg: string): MapUploadResponse => ({ error: msg });
    const okResponse = (fileName: string): MapUploadResponse => ({ name: fileName });

    try {
      if (!mapFile) {
        return res.status(400).json(errorResponse(`No file named 'mapFile'`));
      }

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
