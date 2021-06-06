import { Crag } from "core/types";
import algolaIndex from "../../db/algolia";
import { normalizeRow } from "../../db/dynamodb";
import { SNSHandler, SNSEvent } from "aws-lambda";
import { analytics } from "../../services";

export const handler: SNSHandler = async (event: SNSEvent) => {
  try {
    const promises = event.Records.flatMap((record) => {
      const message = JSON.parse(record.Sns.Message);
      const oldImage = message.dynamodb.OldImage;
      const normalizedRow = normalizeRow<Crag>(oldImage);

      const { slug } = normalizedRow;

      return [
        analytics.incrementGlobalCragCount(-1),
        algolaIndex.deleteObject(slug)
      ];
    });

    await Promise.all(promises as unknown as Promise<any>[]);
  } catch (error) {
    console.error("Error in cragOnRemove", error);
    throw new Error(error);
  }
};
