import AWS from 'aws-sdk';

const IS_OFFLINE = `${process.env.IS_OFFLINE}`;

const dynamoDb = IS_OFFLINE === 'true'
  ? new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  : new AWS.DynamoDB.DocumentClient();

export function normalizeRow<T>(image: {}): T {
  return AWS.DynamoDB.Converter.unmarshall(image)
}


export default dynamoDb;
