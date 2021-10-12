import { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";

export const multerErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof MulterError) {
    console.error(err);
    res.status(500).send({ error: err.message });
  } else {
    next(err);
  }
};

export const genericErrorHandler = (err: Error, req: Request, res: Response, _: NextFunction) => {
  console.error(err);
  res.status(500).send({ error: "Internal server error" });
};
