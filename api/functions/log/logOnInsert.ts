import { crags, areas, routes } from "../../services";

export const handler = async (event) => {
  try {
    const promises = event.Records.flatMap(record => {
      const message = JSON.parse(record.Sns.Message);
      const { S: hk } = message.dynamodb.NewImage.hk;
      const { S: cragSlug } = message.dynamodb.NewImage.cragSlug;
      const { S: areaSlug } = message.dynamodb.NewImage.areaSlug;
      const { S: topoSlug } = message.dynamodb.NewImage.topoSlug;
      const { S: routeSlug } = message.dynamodb.NewImage.routeSlug;

      /**
      * Two records are insertd for each log
      * Only run analytics on one
      */ 
      if (hk.match(/^user#/)) {
        return [
          crags.incrementLogCount(cragSlug),
          areas.incrementLogCount(cragSlug, areaSlug),
          routes.incrementLogCount(cragSlug, areaSlug, topoSlug, routeSlug)
        ]
      }
    })

    await Promise.all(promises);
    console.log("logOnInsert updates done")
    return 200;
  } catch(error) {
    console.error("Error logOnInsert", error);
    throw new Error(error)
  }
}

