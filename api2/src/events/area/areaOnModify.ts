import { Area } from "core/types";
import algolaIndex from "../../db/algolia";
import { normalizeRow } from "../../db/dynamodb";
import { SNSHandler, SNSEvent } from "aws-lambda";
import {crags} from "../../services";

export const didBecomeVerified = (newImage: Area, oldImage: Area) => {
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
      const normalizedNewImage = normalizeRow<Area>(newImage);
      const normalizedOldImage = normalizeRow<Area>(oldImage);

      const { cragSlug, slug } = normalizedNewImage;

      const tasks: Promise<any>[] = []

      const becameVerified = didBecomeVerified(normalizedNewImage, normalizedOldImage);
      if (becameVerified) {
        tasks.push(
          crags.incrementAreaCount(cragSlug),
          algolaIndex.saveObject({
            ...normalizedNewImage,
            model: "area",
            objectID: slug,
          }),
        );
      }

      return tasks;
    });

    await Promise.all(promises);
  } catch (error) {
    console.error("Error in areaOnInsert", error);
    throw new Error(error);
  }
};
