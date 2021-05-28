import { Route } from "core/types";
import algolaIndex from "../../db/algolia";
import { normalizeRow } from "../../db/dynamodb";
import { areas, crags } from "../../services";
import { SNSHandler, SNSEvent } from "aws-lambda";

export const handler: SNSHandler = async (event: SNSEvent) => {
  try {
    const promises = event.Records.flatMap((record) => {
      const message = JSON.parse(record.Sns.Message);
      const newImage = message.dynamodb.NewImage;
      const normalizedRow = normalizeRow<Route>(newImage);

      const { areaSlug, cragSlug, slug } = normalizedRow;

      return [
        areas.incrementRouteCount(cragSlug, areaSlug),
        crags.incrementRouteCount(cragSlug),
        (algolaIndex.saveObject({
          ...normalizedRow,
          model: "route",
          objectID: slug,
        }) as unknown) as Promise<any>,
      ];
    });

    await Promise.all(promises);
  } catch (error) {
    console.error("Error in routesOnInsert", error);
    throw new Error(error);
  }
};
