import { normalizeRow } from "@/db/dynamodb";
import { SNSHandler, SNSEvent } from "aws-lambda";
import { crags, areas, routes, analytics, users } from "@/services";

interface EventRecordImage {
  hk: string;
  cragSlug: string;
  areaSlug: string;
  topoSlug: string;
  routeSlug: string;
  rating: number;
  gradeTaken: string;
  createdAt: string;
  user: {
    picture: string;
    nickname: string;
    sub: string;
  };
}

export const handler: SNSHandler = async (event: SNSEvent) => {
  try {
    const promises = event.Records.map(async (record) => {
      const message = JSON.parse(record.Sns.Message);
      const {
        hk,
        cragSlug,
        areaSlug,
        topoSlug,
        routeSlug,
        rating,
        gradeTaken,
        createdAt,
        user,
      } = normalizeRow<EventRecordImage>(message.dynamodb.NewImage);

      /**
       * Two records are inserted for each log
       * Only run analytics on one
       */
      if (hk.match(/^user#/)) {
        await Promise.all([
          analytics.incrementGlobalLogCount(),
          crags.incrementLogCount(cragSlug),
          areas.incrementLogCount(cragSlug, areaSlug),
          routes.incrementLogCount(cragSlug, areaSlug, topoSlug, routeSlug),
          users.incrementRoutesCompletedCount(user.sub)
        ]);

        await routes.updateMetricsOnLogInsert(
          cragSlug,
          areaSlug,
          topoSlug,
          routeSlug,
          parseInt(`${rating}`, 10),
          parseInt(gradeTaken, 10),
          createdAt,
          user
        );
      }
    });

    await Promise.all(promises);
  } catch (error) {
    console.error("Error logOnInsert", error);
     throw error
  }
};
