import { Request, Response, NextFunction } from "express";
import boom from "@hapi/boom";
import logger from "../logger";

export function errorHandler(
  error: any,
  _: Request,
  response: Response,
  __: NextFunction
) {
  logger.error(`${error}`);

  if (boom.isBoom(error)) {
    response.status(error.output.statusCode).json(error.output.payload);
  } else {
    const boomError = boom.internal("Internal server error");
    response.status(boomError.output.statusCode).json(boomError.output.payload);
  }
}
