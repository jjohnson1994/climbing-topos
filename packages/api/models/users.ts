import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UpdateCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

import { Resource } from "sst";
const dynamodb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const update = async (
  userId: string,
  updateProps: {
    UpdateExpression: string;
    ExpressionAttributeNames: Record<string, string>;
    ExpressionAttributeValues: Record<string, any>;
  }
) => {
  const params = {
    TableName: Resource.climbingtopos2.name,
    Key: {
      "hk": userId,
      "sk": "metadata#"
    },
    ...updateProps
  }

  return dynamodb.send(new UpdateCommand( params ))
}
