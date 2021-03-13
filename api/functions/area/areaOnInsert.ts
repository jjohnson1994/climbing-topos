import { crags } from "../../services";

export const handler = async (event) => {
  console.log("areaOnInsert");
  try {
    const promises = event.Records.map(record => {
      const message = JSON.parse(record.Sns.Message);
      const { S: cragSlug } = message.dynamodb.NewImage.cragSlug;

      return crags.incrementAreaCount(cragSlug);
    })

    await Promise.all(promises)
  } catch (error) {
    console.error("Error in areaOnInsert", error)
  }
}
