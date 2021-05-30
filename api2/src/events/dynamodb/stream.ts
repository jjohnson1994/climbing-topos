import SNS from "../../db/sns";
import { DynamoDBStreamEvent, DynamoDBStreamHandler } from "aws-lambda";

export const handler: DynamoDBStreamHandler = async (
  event: DynamoDBStreamEvent
): Promise<void> => {
  try {
    const promises = event.Records.map((record) => {
      const { eventName } = record;

      if (!eventName) {
        throw new Error(
          "Error in Dynamodb Stream Consumer: record.eventName does not exist"
        );
      }

      if (!record.dynamodb) {
        throw new Error(
          "Error in Dynamodb Stream Consumer: record.dynamodb does not exist"
        );
      }

      const { S: model } = {
        ...record.dynamodb.NewImage,
        ...record.dynamodb.OldImage,
      }.model;

      if (!model) {
        throw new Error(
          'Error in Dynamodb Stream Consumer: no "model" in records'
        );
      }

      const modelUpperCase = model.toUpperCase();
      const eventNameUpperCase = eventName.toUpperCase();
      const topicName = `TOPIC_ARN_${modelUpperCase}_${eventNameUpperCase}`;
      const topicArn = process.env[topicName];

      if (!topicArn) {
        throw new Error(`Error in Dynamodb Stream: Cannot find topicArn for topic named ${topicName}`)
      }

      return SNS.publish({
        Message: JSON.stringify(record),
        TopicArn: topicArn,
      }).promise();
    });

    await Promise.all(promises);
  } catch (error) {
    console.error("error in stream", error);
    throw error;
  }
};
