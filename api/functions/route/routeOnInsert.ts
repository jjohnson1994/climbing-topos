import { Route } from '../../../core/types';
import algolaIndex from '../../db/algolia';
import { normalizeRow } from '../../db/dynamodb';
import { areas, crags } from "../../services";

type Event = {
  Records: [{
    Sns: {
      Message: string;
    },
  }];
}

export const handler = async (event: Event) => {
  try {
    const promises = event.Records.flatMap(record => {
      const message = JSON.parse(record.Sns.Message);
      const newImage = message.dynamodb.NewImage;
      const normalizedRow = normalizeRow<Route>(newImage);

      const { areaSlug, cragSlug, slug } = normalizedRow;

      return [
        areas.incrementRouteCount(cragSlug, areaSlug),
        crags.incrementRouteCount(cragSlug),
        algolaIndex
          .saveObject({
            ...normalizedRow,
            model: "route" ,
            objectID: slug,
          })
      ];
    })

    await Promise.all(promises)
    return 200;
  } catch (error) {
    console.error("Error in routesOnInsert", error)
    throw new Error(error)
  }
}
