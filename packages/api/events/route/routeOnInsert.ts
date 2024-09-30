import { Route } from "@climbingtopos/types";
import algolaIndex from "@/db/algolia";
import { normalizeRow } from "@/db/dynamodb";
import { analytics, areas, crags, users } from "@/services";
import { SNSHandler, SNSEvent } from "aws-lambda";
import { gradingSystems } from "@climbingtopos/globals";

export const handler: SNSHandler = async (event: SNSEvent) => {
  try {
    const promises = event.Records.flatMap((record) => {
      const message = JSON.parse(record.Sns.Message);
      const newImage = message.dynamodb.NewImage;
      const normalizedRow = normalizeRow<Route>(newImage);

      const {
        areaSlug,
        cragSlug,
        slug,
        verified,
        gradingSystem: routeGradingSystem,
        grade,
        createdBy
      } = normalizedRow;

      const normalizedGrade = gradingSystems.find(
        (gradingSystem) => gradingSystem.title === routeGradingSystem
      )?.grades[parseInt(grade, 10)];

      const tasks: Promise<any>[] = [];

      if (verified) {
        tasks.push(
          analytics.incrementGlobalRouteCount(),
          areas.incrementRouteCount(cragSlug, areaSlug),
          crags.incrementRouteCount(cragSlug),
          users.incrementRouteCreatedCount(createdBy.sub),
          algolaIndex.saveObject({
            ...normalizedRow,
            model: "route",
            objectID: slug,
            grade: normalizedGrade,
          })
        );
      }

      return tasks;
    });

    await Promise.all(promises);
  } catch (error) {
    console.error("Error in routesOnInsert", error);
     throw error
  }
};
