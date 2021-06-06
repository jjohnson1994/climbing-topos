import { Route } from "core/types";
import algolaIndex from "../../db/algolia";
import { normalizeRow } from "../../db/dynamodb";
import { analytics, areas, crags } from "../../services";
import { SNSHandler, SNSEvent } from "aws-lambda";

export const handler: SNSHandler = async (event: SNSEvent) => {
  try {
    const promises = event.Records.flatMap((record) => {
      const message = JSON.parse(record.Sns.Message);
      const oldImage = message.dynamodb.OldImage;
      const normalizedRow = normalizeRow<Route>(oldImage);

      const { areaSlug, cragSlug, slug } = normalizedRow;

      return [
        areas.decrementRouteCount(cragSlug, areaSlug),
        crags.decrementRouteCount(cragSlug),
        analytics.incrementGlobalRouteCount(-1),
        algolaIndex.deleteObject(slug),
      ];
    });

    await Promise.all(promises as unknown as Promise<any>[]);
  } catch (error) {
    console.error("Error in routeOnRemove", error);
    throw new Error(error);
  }
};
