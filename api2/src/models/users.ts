import { ExpressionAttributeNameMap, UpdateExpression } from "aws-sdk/clients/dynamodb";
import { dynamodb } from "../db";

export const update = async (
  userId: string,
  updateProps: {
    UpdateExpression: UpdateExpression;
    ExpressionAttributeNames: ExpressionAttributeNameMap;
    ExpressionAttributeValues: { [key: string]: any };
  }
) => {
  const params = {
    TableName: String(process.env.tableName),
    Key: {
      "hk": userId,
      "sk": "metadata#"
    },
    ...updateProps
  }

  return dynamodb.update(params).promise()
}
