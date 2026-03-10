import { Route } from '@climbingtopos/types';
import algolaIndex from '@/db/algolia';
import { normalizeRow } from '@/db/dynamodb';
import { analytics, areas, crags } from '@/services';
import { logs } from '@/models';
import { SNSHandler, SNSEvent } from 'aws-lambda';
import { gradingSystems } from '@climbingtopos/globals';

export const didBecomeVerified = (newImage: Route, oldImage: Route) => {
  if (newImage.verified === true && oldImage.verified === false) {
    return true;
  }

  return false;
};

export const handler: SNSHandler = async (event: SNSEvent) => {
  try {
    const promises = event.Records.map(async (record) => {
      const message = JSON.parse(record.Sns.Message);
      const newImage = message.dynamodb.NewImage;
      const oldImage = message.dynamodb.OldImage;
      const normalizedNewImage = normalizeRow<Route>(newImage);
      const normalizedOldImage = normalizeRow<Route>(oldImage);
      const normalizedGrade = gradingSystems.find(
        (gradingSystem) =>
          gradingSystem.title === normalizedNewImage.gradingSystem,
      )?.grades[parseInt(normalizedNewImage.grade, 10)];

      const { areaSlug, cragSlug, slug, topoSlug } = normalizedNewImage;

      const tasks: Promise<any>[] = [];

      const becameVerified = didBecomeVerified(
        normalizedNewImage,
        normalizedOldImage,
      );

      if (becameVerified) {
        tasks.push(
          analytics.incrementGlobalRouteCount(),
          areas.incrementRouteCount(cragSlug, areaSlug),
          crags.incrementRouteCount(cragSlug),
        );
      }

      if (normalizedNewImage.verified === true) {
        tasks.push(
          algolaIndex.saveObject({
            ...normalizedNewImage,
            model: 'route',
            objectID: slug,
            grade: normalizedGrade,
          }),
        );
      }

      const logFieldsToUpdate: Record<string, any> = {};

      if (normalizedNewImage.title !== normalizedOldImage.title) {
        logFieldsToUpdate.routeTitle = normalizedNewImage.title;
      }
      if (normalizedNewImage.grade !== normalizedOldImage.grade) {
        logFieldsToUpdate.grade = normalizedNewImage.grade;
      }
      if (normalizedNewImage.gradingSystem !== normalizedOldImage.gradingSystem) {
        logFieldsToUpdate.gradingSystem = normalizedNewImage.gradingSystem;
      }
      if (
        logFieldsToUpdate.grade !== undefined ||
        logFieldsToUpdate.gradingSystem !== undefined
      ) {
        logFieldsToUpdate.gradeModal = normalizedNewImage.gradeModal;
      }
      if (normalizedNewImage.routeType !== normalizedOldImage.routeType) {
        logFieldsToUpdate.routeType = normalizedNewImage.routeType;
      }
      if (
        JSON.stringify(normalizedNewImage.tags) !==
        JSON.stringify(normalizedOldImage.tags)
      ) {
        logFieldsToUpdate.tags = normalizedNewImage.tags;
      }

      await Promise.all(tasks);

      if (Object.keys(logFieldsToUpdate).length > 0) {
        const routeLogs = await logs.getLogsForRoute(
          cragSlug,
          areaSlug,
          topoSlug,
          slug,
        );
        const logUpdates = routeLogs.flatMap((log) => {
          const userLogSk = `log#crag#${log.cragSlug}#area#${log.areaSlug}#topo#${log.topoSlug}#route#${log.routeSlug}#${log.slug}`;
          return [
            logs.updateLog(log.hk, log.sk, logFieldsToUpdate),
            logs.updateLog(`user#${log.user.sub}`, userLogSk, logFieldsToUpdate),
          ];
        });
        for (let i = 0; i < logUpdates.length; i += 50) {
          await Promise.all(logUpdates.slice(i, i + 50));
        }
      }
    });

    await Promise.all(promises);
  } catch (error) {
    console.error('Error in routeOnModify', error);
    throw error;
  }
};
