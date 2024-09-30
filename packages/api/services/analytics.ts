import { Resource } from "sst";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UpdateCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const incrementGlobalCragCount = (count = 1) => {
  const params = {
    TableName: Resource.climbingtopos2.name,
    Key: {
      hk: 'globals',
      sk: 'metadata',
    },
    UpdateExpression: "add #cragCount :inc",
    ExpressionAttributeNames: { 
      "#cragCount": "cragCount",
    },
    ExpressionAttributeValues: {
      ":inc": count
    }
  }

  return dynamoDb.send(new UpdateCommand(params))
}

export const incrementGlobalRouteCount = (count = 1) => {
  const params = {
    TableName: Resource.climbingtopos2.name,
    Key: {
      hk: 'globals',
      sk: 'metadata',
    },
    UpdateExpression: "add #routeCount :inc",
    ExpressionAttributeNames: { 
      "#routeCount": "routeCount",
    },
    ExpressionAttributeValues: {
      ":inc": count
    },
  }

  return dynamoDb.send(new UpdateCommand(params))
}

export const incrementGlobalLogCount = (count = 1) => {
  const params = {
    TableName: Resource.climbingtopos2.name,
    Key: {
      hk: 'globals',
      sk: 'metadata',
    },
    UpdateExpression: "add #logCount :inc",
    ExpressionAttributeNames: { 
      "#logCount": "logCount",
    },
    ExpressionAttributeValues: {
      ":inc": count
    },
  }

  return dynamoDb.send(new UpdateCommand(params))
}
