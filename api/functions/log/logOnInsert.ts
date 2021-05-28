import {string} from "yup/lib/locale";
import { normalizeRow } from "../../db/dynamodb";
import { crags, areas, routes, logs } from "../../services";

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
  }
}

export const handler = async (event) => {
  try {
    const promises = event.Records.map(async record => {
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
        user 
      } = normalizeRow<EventRecordImage>(message.dynamodb.NewImage)

      /**
      * Two records are insertd for each log
      * Only run analytics on one
      */ 
      if (hk.match(/^user#/)) {
        return new Promise(async (resolve) => {
          await Promise.all([
            crags.incrementLogCount(cragSlug),
            areas.incrementLogCount(cragSlug, areaSlug),
            routes.incrementLogCount(cragSlug, areaSlug, topoSlug, routeSlug),
          ]);

          await routes.updateMetricsOnLogInsert(
            cragSlug,
            areaSlug,
            topoSlug,
            routeSlug,
            parseInt(rating, 10),
            parseInt(gradeTaken, 10),
            createdAt,
            user
          );

          resolve(true)
        })
      }
    })

    await Promise.all(promises);
    return 200;
  } catch(error) {
    console.error("Error logOnInsert", error);
    throw new Error(error)
  }
}

