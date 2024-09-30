import { Crag } from "@climbingtopos/types";
import algolaIndex from "@/db/algolia";
import { normalizeRow } from "@/db/dynamodb";
import { SNSHandler, SNSEvent } from "aws-lambda";

export const handler: SNSHandler = async (event: SNSEvent) => {
  try {
    const promises = event.Records.flatMap((record) => {
      const message = JSON.parse(record.Sns.Message);
      const newImage = message.dynamodb.NewImage;
      const normalizedRow = normalizeRow<Crag>(newImage);

      const { slug } = normalizedRow;

      return [
        algolaIndex.saveObject({
          ...normalizedRow,
          model: "crag",
          objectID: slug,
        }),
      ];
    });

    await Promise.all(promises);
  } catch (error) {
    console.error("Error in cragOnInsert", error);
    throw error
  }
};
