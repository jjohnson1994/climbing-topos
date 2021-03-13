import { crags, areas } from "../../services";

export const handler = async (event) => {
  console.log("routeonInsert")
  try {
    const promises = event.Records.flatMap(record => {
      const message = JSON.parse(record.Sns.Message);
      const { S: cragSlug } = message.dynamodb.NewImage.cragSlug;
      const { S: areaSlug } = message.dynamodb.NewImage.areaSlug;

      return [
        areas.incrementRouteCount(cragSlug, areaSlug),
        crags.incrementRouteCount(cragSlug)
      ];
    })

    await Promise.all(promises)
    console.log("Promises done")
    return 200;
  } catch (error) {
    console.error("Error in routesOnInsert", error)
    throw new Error(error)
  }
}
