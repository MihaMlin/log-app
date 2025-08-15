import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import { AppErrorCode } from "../constants/appErrorCode";

const notFoundHandler =
  () =>
  (req: Request, res: Response, next: NextFunction): void => {
    next(
      new AppError(
        404,
        `Not Found - ${req.method} ${req.originalUrl}`,
        AppErrorCode.ResourceNotFound
      )
    );
  };

export default notFoundHandler;
