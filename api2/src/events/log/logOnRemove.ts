import { Log } from "core/types";
import { SNSEvent, SNSHandler } from "aws-lambda";
import { normalizeRow } from "../../db/dynamodb";
import { analytics, areas, crags, routes } from "../../services";

export const handler: SNSHandler = async (event: SNSEvent) => {
  try {
    const promises = event.Records.flatMap((record) => {
      const message = JSON.parse(record.Sns.Message);
      const oldImage = message.dynamodb.OldImage;
      const normalizedRow = normalizeRow<Log>(oldImage);

      const { cragSlug, areaSlug, topoSlug, routeSlug } = normalizedRow;

      return [
        crags.decrementLogCount(cragSlug),
        areas.decrementLogCount(cragSlug, areaSlug),
        routes.decrementLogCount(
          cragSlug,
          areaSlug,
          topoSlug,
          routeSlug
        ),
        analytics.incrementGlobalLogCount(-1),
      ];
    });

    await Promise.all(promises as unknown as Promise<any>[]);
  } catch (error) {
    console.error("Error in routeOnRemove", error);
    throw new Error(error);
  }
};
