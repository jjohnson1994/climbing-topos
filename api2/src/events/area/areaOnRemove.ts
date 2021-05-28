import { Area } from "core/types";
import algolaIndex from "../../db/algolia";
import { normalizeRow } from "../../db/dynamodb";
import { SNSHandler, SNSEvent } from "aws-lambda";

export const handler: SNSHandler = async (event: SNSEvent) => {
  try {
    const promises = event.Records.flatMap((record) => {
      const message = JSON.parse(record.Sns.Message);
      const newImage = message.dynamodb.NewImage;
      const normalizedRow = normalizeRow<Area>(newImage);

      const { slug } = normalizedRow;

      return [algolaIndex.deleteObject(slug)];
    });

    await Promise.all(promises);
  } catch (error) {
    console.error("Error in areaOnRemove", error);
    throw new Error(error);
  }
};
