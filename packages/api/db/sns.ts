import { SNSClient, PublishCommand } from '@aws-sdk/client-sns'

// config.update({ region: `${process.env.AWS_REGION}` });

const SnsClient = new SNSClient({
  apiVersion: '2010-03-31'
});

export default {
  publish: ({ Message, TopicArn }: { Message: string, TopicArn: string }) => {
    return SnsClient.send(new PublishCommand({
      Message, TopicArn
    }))
  }
}
