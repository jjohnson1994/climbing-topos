import { crags, areas, routes, logs } from "../../services";

export const handler = async (event) => {
  try {
    const promises = event.Records.map(async record => {
      const message = JSON.parse(record.Sns.Message);
      const { S: hk } = message.dynamodb.NewImage.hk;
      const { S: cragSlug } = message.dynamodb.NewImage.cragSlug;
      const { S: areaSlug } = message.dynamodb.NewImage.areaSlug;
      const { S: topoSlug } = message.dynamodb.NewImage.topoSlug;
      const { S: routeSlug } = message.dynamodb.NewImage.routeSlug;
      const { N: rating } = message.dynamodb.NewImage.rating;
      const { N: gradeTaken } = message.dynamodb.NewImage.gradeTaken;

      console.log({ hk, cragSlug, areaSlug, topoSlug, routeSlug, rating })

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

