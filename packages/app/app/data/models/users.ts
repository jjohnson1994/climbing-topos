import { DateTime } from 'luxon';
import { nanoid } from 'nanoid';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  GetCommand,
  PutCommand,
  UpdateCommand,
  DynamoDBDocumentClient,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';

import { Resource } from 'sst';
const dynamodb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const update = async (
  userId: string,
  updateProps: {
    UpdateExpression: string;
    ExpressionAttributeNames: Record<string, string>;
    ExpressionAttributeValues: Record<string, any>;
    ConditionExpression?: string;
  },
) => {
  const params = {
    TableName: Resource.climbingtopos2.name,
    Key: {
      hk: userId,
      sk: 'metadata#',
    },
    ...updateProps,
  };

  return dynamodb.send(new UpdateCommand(params));
};

export const createUser = async (
  pendingUserData: {
    email: string;
    hashedPassword: string;
    verificationCode: number;
  },
  status = 'pending',
) => {
  const date = DateTime.utc().toString();
  const uid = nanoid();

  const params = {
    TableName: Resource.climbingtopos2.name,
    Item: {
      hk: uid,
      sk: 'metadata#',
      ...pendingUserData,
      verificationCodeExpiration: DateTime.utc()
        .plus({ minutes: 15 })
        .toString(),
      model: 'user',
      status,
      id: uid,
      slug: pendingUserData.email,
      createdAt: date,
    },
  };

  await dynamodb.send(new PutCommand(params));
};

export async function getUserById(id: string) {
  const result = await dynamodb.send(
    new GetCommand({
      TableName: Resource.climbingtopos2.name,
      Key: { hk: id, sk: 'metadata#' },
    }),
  );
  return result.Item;
}

export async function getUserByEmail(email: string) {
  const params = {
    TableName: Resource.climbingtopos2.name,
    IndexName: 'gsi2',
    KeyConditionExpression: '#hk = :hk AND #sk = :sk',
    ExpressionAttributeNames: {
      '#hk': 'model',
      '#sk': 'slug',
    },
    ExpressionAttributeValues: {
      ':hk': 'user',
      ':sk': email,
    },
  };

  const user = await dynamodb.send(new QueryCommand(params));

  if (user.Items?.[0]) {
    return user.Items[0];
  }
}
