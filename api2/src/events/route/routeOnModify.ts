import { Route } from "core/types";
import algolaIndex from "../../db/algolia";
import { normalizeRow } from "../../db/dynamodb";
import { analytics, areas, crags } from "../../services";
import { SNSHandler, SNSEvent } from "aws-lambda";

export const didBecomeVerified = (newImage: Route, oldImage: Route) => {
  if (newImage.verified === true && oldImage.verified === false) {
    return true;
  }

  return false;
}

export const handler: SNSHandler = async (event: SNSEvent) => {
  try {
    const promises = event.Records.flatMap((record) => {
      const message = JSON.parse(record.Sns.Message);
      const newImage = message.dynamodb.NewImage;
      const oldImage = message.dynamodb.OldImage;
      const normalizedNewImage = normalizeRow<Route>(newImage);
      const normalizedOldImage = normalizeRow<Route>(oldImage);

      const { areaSlug, cragSlug, slug } = normalizedNewImage;

      const tasks: Promise<any>[] = []

      const becameVerified = didBecomeVerified(normalizedNewImage, normalizedOldImage);
      if (becameVerified) {
        tasks.push(
          analytics.incrementGlobalRouteCount(),
          areas.incrementRouteCount(cragSlug, areaSlug),
          crags.incrementRouteCount(cragSlug)
        )
      }

      if (normalizedNewImage.verified === true) {
        tasks.push(
          algolaIndex.saveObject({
            ...normalizedNewImage,
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
