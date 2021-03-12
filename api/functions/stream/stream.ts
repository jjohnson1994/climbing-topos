import SNS, { generateTopicArn } from "../../db/sns";

const IS_OFFLINE = `${process.env.IS_OFFLINE}`;

export const handler = async (event, context) => {
  console.log("steam triggered", process.env.AWS_REGION, process.env.AWS_ACCOUNT_ID, event)
  event.Records.forEach(record => {
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

    SNS.publish({
      Message: JSON.stringify(record),
      TopicArn: topicArn
    })
      .promise()
      .then(() => {
        console.log(`SNS publish ${topicArn}`)
      })
      .catch(error => {
        console.log(`SNS error, ${topicArn}`, error)
      })
  });
  return true;
}
