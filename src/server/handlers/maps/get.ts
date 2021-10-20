import { NextFunction, Request, Response } from "express";
import fs from "fs";

export const mapGetHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { fileName } = req.params;
  const mapFileName = `uploads/maps/${fileName}`;
  try {
    if (!fs.existsSync(mapFileName)) {
      return res.status(404);
    }
    res.set("Content-Type", "image/jpg");
    res.send(fs.readFileSync(mapFileName)).end();
  } catch (err: unknown) {
    next(err);
  }
};
