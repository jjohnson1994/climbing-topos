import { crags } from "../../services";

export const handler = async (event) => {
  event.Records.forEach(record => {
    console.log("areaOnInsert");
    const message = JSON.parse(record.Sns.Message);
    const { S: cragSlug } = message.dynamodb.NewImage.cragSlug;

    crags.incrementAreaCount(cragSlug);
  })
}
