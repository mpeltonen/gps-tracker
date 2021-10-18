import { Request, Response } from "express";
import * as fs from "fs";

export const mapsGetHandler = async (ignored: Request, res: Response) => {
  const fileNames = fs.readdirSync("uploads/maps");
  const response = fileNames.filter((fn) => fn.endsWith(".json")).map((fn) => ({ id: fn.split(".")[0] }));
  res.json(response);
};
