import SNS, { generateTopicArn } from "../../db/sns";

const IS_OFFLINE = `${process.env.IS_OFFLINE}`;

export const handler = async (event, context) => {
  console.log("steam triggered", process.env.AWS_REGION, process.env.AWS_ACCOUNT_ID, event)
  try {
    const promises = event.Records.map(record => {
      const { eventName } = record;
      const { S: model } = record.dynamodb.NewImage.model;
      const awsAccountId = `${process.env.AWS_ACCOUNT_ID}`;
      const awsRegion = `${process.env.AWS_REGION}`;
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
    console.log("published")

    return true;
  } catch (error) {
    console.error("error in stream", error)
  } finally {
    console.log("stream complete")
    return true
  }
}
