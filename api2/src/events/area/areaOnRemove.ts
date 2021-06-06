import { Area } from "core/types";
import algolaIndex from "../../db/algolia";
import { normalizeRow } from "../../db/dynamodb";
import { SNSHandler, SNSEvent } from "aws-lambda";
import { crags } from "../../services";

export const handler: SNSHandler = async (event: SNSEvent) => {
  try {
    const promises = event.Records.flatMap((record) => {
      const message = JSON.parse(record.Sns.Message);
      const oldImage = message.dynamodb.OldImage;
      const normalizedRow = normalizeRow<Area>(oldImage);

      const { cragSlug, slug } = normalizedRow;

      return [
        crags.decrementAreaCount(cragSlug),
        algolaIndex.deleteObject(slug),
      ];
    });

    await Promise.all(promises as unknown as Promise<any>[]);
  } catch (error) {
    console.error("Error in areaOnRemove", error);
    throw new Error(error);
  }
};
