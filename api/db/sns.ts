import AWS from 'aws-sdk';
AWS.config.update({ region: `${process.env.AWS_REGION}` });

const IS_OFFLINE = `${process.env.IS_OFFLINE}`;

const SNS = IS_OFFLINE === 'true'
  ? new AWS.SNS({
      endpoint: 'http://127.0.0.1:4002',
      region: `${process.env.AWS_REGION}`,
      apiVersion: '2010-03-31'
    })
  : new AWS.SNS({
      region: `${process.env.AWS_REGION}`,
      apiVersion: '2010-03-31'
    });

export default SNS;

export const generateTopicArn = (eventName: string, model: string, awsRegion: string, awsAccountId: string) => {
  const eventNameLowerCase = eventName.toLowerCase();
  const modelLowerCase = model.toLowerCase();
  return `arn:aws:sns:${awsRegion}:${awsAccountId}:${modelLowerCase}-${eventNameLowerCase}`
}

