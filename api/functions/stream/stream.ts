import SNS, { generateTopicArn } from "../../db/sns";

const IS_OFFLINE = `${process.env.IS_OFFLINE}`;
const awsAccountId = `${process.env.AWS_ACCOUNT_ID}`;
const awsRegion = `${process.env.AWS_REGION}`;

export const handler = async (event, context) => {
  try {
    const promises = event.Records.map(record => {
      console.log('stream', record)
      const { eventName } = record;
      const { S: model } = { ...record.dynamodb.NewImage, ...record.dynamodb.OldImage }.model;
      const topicArn = generateTopicArn(
        eventName,
        model,
        awsRegion,
        IS_OFFLINE === 'true' ? '123456789012' : awsAccountId
      );

      return SNS.publish({
        Message: JSON.stringify(record),
        TopicArn: topicArn
      })
        .promise()
    });

    await Promise.all(promises)

    return 200;
  } catch (error) {
    console.error("error in stream", error)
    throw error;
  }
}
