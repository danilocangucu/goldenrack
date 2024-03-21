import { Request, Response } from "express";
import boom from "@hapi/boom";

import recordsService from "../services/records";
import logger from "../logger";

export async function getAllRecordsHandler(_: Request, response: Response) {
  try {
    const allRecords = await recordsService.getAllRecords();
    response.status(200).json(allRecords);
  } catch (error) {
    logger.error("Error fetching records:", error);
    const boomError = boom.internal("Internal server error");
    response.status(boomError.output.statusCode).json(boomError.output.payload);
  }
}
