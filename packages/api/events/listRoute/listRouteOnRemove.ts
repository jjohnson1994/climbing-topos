import { normalizeRow } from '@/db/dynamodb';
import { SNSHandler, SNSEvent } from 'aws-lambda';
import { lists } from '@/services';

interface EventRecordImage {
  hk: string;
  listSlug: string;
}

export const handler: SNSHandler = async (event: SNSEvent) => {
  try {
    const promises = event.Records.map(async (record) => {
      const message = JSON.parse(record.Sns.Message);
      const { hk, listSlug } =
        normalizeRow<EventRecordImage>(message.dynamodb.OldImage);

      // Extract userSub from hk (format: "user#<userSub>")
      const userSub = hk.replace('user#', '');

      await lists.decrementRoutesCount(listSlug, userSub);
    });

    await Promise.all(promises);
  } catch (error) {
    console.error('Error listRouteOnRemove', error);
    throw error;
  }
};
