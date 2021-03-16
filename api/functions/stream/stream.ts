import SNS, { generateTopicArn } from "../../db/sns";

const IS_OFFLINE = `${process.env.IS_OFFLINE}`;
const awsAccountId = `${process.env.AWS_ACCOUNT_ID}`;
const awsRegion = `${process.env.AWS_REGION}`;

export const handler = async (event, context) => {
  try {
    const promises = event.Records.map(record => {
      const { eventName } = record;
      const { S: model } = record.dynamodb.NewImage.model;
      const topicArn = generateTopicArn(
        eventName,
        model,
        awsRegion,
        IS_OFFLINE === 'true' ? '123456789012' : awsAccountId
      );

      console.log({ TopicArn: topicArn })
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
  } finally {
    console.log("stream complete")
    return 200;
  }
}
