import { Crag } from "core/types";
import algolaIndex from "../../db/algolia";
import { normalizeRow } from "../../db/dynamodb";
import { SNSHandler, SNSEvent } from "aws-lambda";
import { analytics, users } from "../../services";

export const handler: SNSHandler = async (event: SNSEvent) => {
  try {
    const promises = event.Records.flatMap((record) => {
      const message = JSON.parse(record.Sns.Message);
      const newImage = message.dynamodb.NewImage;
      const normalizedRow = normalizeRow<Crag>(newImage);

      const { slug, createdBy } = normalizedRow;

      return [
        analytics.incrementGlobalCragCount(),
        users.incrementCragCreatedCount(createdBy.sub),
        algolaIndex.saveObject({
          ...normalizedRow,
          model: "crag",
          objectID: slug,
        }),
      ];
    });

    await Promise.all(promises as unknown as Promise<any>[]);
  } catch (error) {
    console.error("Error in cragOnInsert", error);
    throw new Error(error);
  }
};
