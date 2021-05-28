import { config, SNS } from 'aws-sdk';

config.update({ region: `${process.env.AWS_REGION}` });

const SnsClient = new SNS({
  region: `${process.env.AWS_REGION}`,
  apiVersion: '2010-03-31'
});

export default SnsClient;

export const generateTopicArn = (eventName: string, model: string, awsRegion: string, awsAccountId: string) => {
  const eventNameLowerCase = eventName.toLowerCase();
  const modelLowerCase = model.toLowerCase();
  return `arn:aws:sns:${awsRegion}:${awsAccountId}:${modelLowerCase}-${eventNameLowerCase}`
}

