import { ExpressionAttributeNameMap, UpdateExpression } from "aws-sdk/clients/dynamodb";
import { dynamodb } from "../db";

export async function update(
  userId: string,
  updateProps: {
    UpdateExpression: UpdateExpression;
    ExpressionAttributeNames: ExpressionAttributeNameMap;
    ExpressionAttributeValues: { [key: string]: any };
  }
) {
  try {
    const params = {
      TableName: String(process.env.tableName),
      Key: {
        "hk": userId,
        "sk": "metadata#"
      },
      ...updateProps
    }

    const response = await dynamodb.update(params).promise()
  } catch (error) {
    console.error("Error updating user", error)
  }
}
