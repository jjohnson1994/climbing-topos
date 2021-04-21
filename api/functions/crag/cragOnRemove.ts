import { Crag } from '../../../core/types';
import algolaIndex from '../../db/algolia';
import { normalizeRow } from '../../db/dynamodb';

type Event = {
  Records: [{
    Sns: {
      Message: string;
    },
  }];
}

export const handler = async (event: Event) => {
  try {
    const promises = event.Records.flatMap(record => {
      const message = JSON.parse(record.Sns.Message);
      const newImage = message.dynamodb.NewImage;
      const normalizedRow = normalizeRow<Crag>(newImage);

      const { slug } = normalizedRow;

      return [
        algolaIndex.deleteObject(slug)
      ];
    })

    await Promise.all(promises)
    return 200;
  } catch (error) {
    console.error("Error in cragOnRemove", error)
    throw new Error(error)
  }
}
