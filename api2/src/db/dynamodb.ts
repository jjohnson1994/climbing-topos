import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient

export function normalizeRow<T>(image: { [key: string]: any }): T {
  return DynamoDB.Converter.unmarshall(image) as T
}


export default dynamoDb;
