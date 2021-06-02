import { ExpressionAttributeNameMap, UpdateExpression } from "aws-sdk/clients/dynamodb";
import { dynamodb } from '../db';

export const update = (updateProps: {
  UpdateExpression: UpdateExpression;
  ExpressionAttributeNames: ExpressionAttributeNameMap;
  ExpressionAttributeValues: { [key: string]: any };
}) => {
  const params = {
    TableName: String(process.env.tableName),
    Key: {
      hk: 'globals',
      sk: 'metadata',
    },
    ...updateProps,
  };

  return dynamodb.update(params, (err) => {
    if (err) {
      console.error(err);
    }
  });
};
