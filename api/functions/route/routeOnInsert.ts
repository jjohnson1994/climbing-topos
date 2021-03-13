import { crags, areas } from "../../services";

export const handler = async (event) => {
  console.log("routeonInsert")
  try {
    const promises = [];
    event.Records.forEach(record => {
      const message = JSON.parse(record.Sns.Message);
      const { S: cragSlug } = message.dynamodb.NewImage.cragSlug;
      const { S: areaSlug } = message.dynamodb.NewImage.areaSlug;

      promises.push(areas.incrementRouteCount(cragSlug, areaSlug));
      promises.push(crags.incrementRouteCount(cragSlug));
    })

    await Promise.all(promises)
    console.log("Promises done")
  } catch (error) {
    console.error("Error in routesOnInsert", error)
  }
}
