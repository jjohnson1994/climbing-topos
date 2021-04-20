import { Area } from "../../../core/types";
import algolaIndex from '../../db/algolia';
import { normalizeRow } from '../../db/dynamodb';
import { crags } from "../../services";

type Event = {
  Records: [{
    Sns: {
      Message: string;
    },
  }];
}

export const handler = async (event: Event) => {
  console.log('areaOnInsert', event)
  try {
    const promises = event.Records.flatMap(record => {
      const message = JSON.parse(record.Sns.Message);
      const newImage = message.dynamodb.NewImage;
      const normalizedRow = normalizeRow<Area>(newImage);

      const { cragSlug, slug } = normalizedRow;

      return [
        crags.incrementAreaCount(cragSlug),
        algolaIndex
          .saveObject({
            ...normalizedRow,
            model: "area" ,
            objectID: slug,
          })
      ];
    })

    await Promise.all(promises)
    return 200;
  } catch (error) {
    console.error("Error in areaOnInsert", error)
    throw new Error(error)
  }
}
