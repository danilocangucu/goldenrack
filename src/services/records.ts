import boom, { boomify } from "@hapi/boom";
import Record, { RecordDocument } from "../model/Record";

export async function getAllRecords(): Promise<RecordDocument[]> {
  try {
    const allRecords = await Record.find();
    return allRecords;
  } catch (error) {
    if (error instanceof Error) {
      throw boomify(error as Error, {
        statusCode: 500,
        message: "Failed to fetch records",
      });
    } else {
      throw boom.internal("Unknown error occurred while fetching records.");
    }
  }
}

export default { getAllRecords };
