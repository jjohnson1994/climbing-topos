import { Area } from "core/types";
import algolaIndex from "../../db/algolia";
import { normalizeRow } from "../../db/dynamodb";
import { crags } from "../../services";
import { SNSHandler, SNSEvent } from "aws-lambda";

export const handler: SNSHandler = async (event: SNSEvent) => {
  try {
    const promises = event.Records.flatMap((record) => {
      const message = JSON.parse(record.Sns.Message);
      const newImage = message.dynamodb.NewImage;
      const normalizedRow = normalizeRow<Area>(newImage);

      const { cragSlug, slug } = normalizedRow;

      return [
        crags.incrementAreaCount(cragSlug),
        (algolaIndex.saveObject({
          ...normalizedRow,
          model: "area",
          objectID: slug,
        }) as unknown) as Promise<any>,
      ];
    });

    await Promise.all(promises);
  } catch (error) {
    console.error("Error in areaOnInsert", error);
    throw new Error(error);
  }
};
