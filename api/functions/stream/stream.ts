import SNS, { generateTopicArn } from "../../db/sns";

export const handler = async (event, context) => {
  event.Records.forEach(record => {
    const { eventName } = record;
    const { S: model } = record.dynamodb.NewImage.model;
    const awsAccountId = `${process.env.AWS_ACCOUNT_ID}`;
    const awsRegion = `${process.env.AWS_REGION}`;
    const topicArn = generateTopicArn(eventName, model, awsRegion, '123456789012');

    console.log("publishing to", topicArn);
    SNS.publish({
      Message: JSON.stringify({}),
      TopicArn: topicArn
    })

    console.log({ eventName, model, topicArn });
  });
  return true;
}
