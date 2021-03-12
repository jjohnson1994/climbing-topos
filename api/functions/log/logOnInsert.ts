import { crags, areas, routes } from "../../services";

export const handler = async (event) => {
  event.Records.forEach(record => {
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
      crags.incrementLogCount(cragSlug)
      areas.incrementLogCount(cragSlug, areaSlug)
      routes.incrementLogCount(cragSlug, areaSlug, topoSlug, routeSlug)
    }
  })
}

