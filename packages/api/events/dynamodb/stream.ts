import SNS from "@/db/sns";
import { SNSHandler } from "aws-lambda";

// todo types
export const handler: SNSHandler = async ( event: any ): Promise<void> => {
  console.log('atreaming')
  try {
    const promises = event.Records.map((record) => {
      const { eventName } = record;

      console.log('stream')

      if (!eventName) {
        throw new Error(
          "Error in Dynamodb Stream Consumer: record.eventName does not exist"
        );
      }

      console.log('event name', { eventName })

      if (!record.dynamodb) {
        throw new Error(
          "Error in Dynamodb Stream Consumer: record.dynamodb does not exist"
        );
      }

      const modelMarshalled = {
        ...record.dynamodb.NewImage,
        ...record.dynamodb.OldImage,
      }.model;

      if (!modelMarshalled) {
        // Only publish changes to objects with Models
        return;
      }

      console.log('model marshalled', { modelMarshalled })

      const { S: model } = modelMarshalled;

      if (!model) {
        // Only publish changes to objects with Models
        return;
      }

      console.log('model', { model })

      const modelUpperCase = model.toUpperCase();
      const eventNameUpperCase = eventName.toUpperCase();
      const topicName = `TOPIC_ARN_${modelUpperCase}_${eventNameUpperCase}`;
      const topicArn = process.env[topicName];

      console.log({ topicName, topicArn})

      if (!topicArn) {
        return;
      }

      return SNS.publish({
        Message: JSON.stringify(record),
        TopicArn: topicArn,
      })
    });

    await Promise.all(promises);
  } catch (error) {
    console.error("error in stream", error);
    throw error;
  }
};
