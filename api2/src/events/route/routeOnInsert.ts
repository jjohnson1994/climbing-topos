import { Route } from "core/types";
import algolaIndex from "../../db/algolia";
import { normalizeRow } from "../../db/dynamodb";
import { analytics, areas, crags } from "../../services";
import { SNSHandler, SNSEvent } from "aws-lambda";

export const handler: SNSHandler = async (event: SNSEvent) => {
  try {
    const promises = event.Records.flatMap((record) => {
      const message = JSON.parse(record.Sns.Message);
      const newImage = message.dynamodb.NewImage;
      const normalizedRow = normalizeRow<Route>(newImage);

      const { areaSlug, cragSlug, slug, verified } = normalizedRow;

      const tasks: Promise<any>[] = []

      if (verified) {
        tasks.push(
          analytics.incrementGlobalRouteCount(),
          areas.incrementRouteCount(cragSlug, areaSlug),
          crags.incrementRouteCount(cragSlug),
          algolaIndex.saveObject({
            ...normalizedRow,
            model: "route",
            objectID: slug,
          })
        )
      }

      return tasks;
    });

    await Promise.all(promises);
  } catch (error) {
    console.error("Error in routesOnInsert", error);
    throw new Error(error);
  }
};
