import { crags, areas } from "../../services";

export const handler = async (event) => {
  event.Records.forEach(record => {
    console.log("routesOnInsert");
    const message = JSON.parse(record.Sns.Message);
    const { S: cragSlug } = message.dynamodb.NewImage.cragSlug;
    const { S: areaSlug } = message.dynamodb.NewImage.areaSlug;

    areas.incrementRouteCount(cragSlug, areaSlug);
    crags.incrementRouteCount(cragSlug);
  })
}
