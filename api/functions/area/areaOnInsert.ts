import { crags } from "../../services";

export const handler = async (event) => {
  try {
    const promises = event.Records.map(record => {
      console.log("areaOnInsert");
      const message = JSON.parse(record.Sns.Message);
      const { S: cragSlug } = message.dynamodb.NewImage.cragSlug;

      console.log("Incrementing area count", cragSlug)
      return crags.incrementAreaCount(cragSlug);
    })

    console.log("areaOnInsert awaiting")
    await promises
    console.log("areaOnInsert done")
  } catch (error) {
    console.error("Error in areaOnInsert", error)
  } finally {
    return true
  }
}
