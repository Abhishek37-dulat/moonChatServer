import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import Logger from "../utils/logger";
import HTTP_STATUSES from "../utils/httpStatuses";

const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Logger.error(`${err.status} - ${err.message}`);

  if (!err.isOperational) {
    err.statusCode = HTTP_STATUSES.INTERNAL_SERVER_ERROR.code;
    err.message = HTTP_STATUSES.INTERNAL_SERVER_ERROR.message;
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

export default errorHandler;
