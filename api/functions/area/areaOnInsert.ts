import { crags } from "../../services";

export const handler = async (event) => {
  try {
    const promises = event.Records.map(record => {
      console.log("areaOnInsert");
      const message = JSON.parse(record.Sns.Message);
      const { S: cragSlug } = message.dynamodb.NewImage.cragSlug;

      return crags.incrementAreaCount(cragSlug);
    })

    console.error("areaOnInsert awaiting")
    await promises
    console.error("areaOnInsert done")
  } finally {
    return true
  }
}
