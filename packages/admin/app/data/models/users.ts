import 'server-only';
import {
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { db, getTableName } from '../db';

export async function listUsers(limit = 50, lastKey?: Record<string, unknown>) {
  const params = {
    TableName: await getTableName(),
    IndexName: 'gsi1',
    KeyConditionExpression: '#model = :model',
    ExpressionAttributeNames: { '#model': 'model' },
    ExpressionAttributeValues: { ':model': 'user' },
    Limit: limit,
    ...(lastKey ? { ExclusiveStartKey: lastKey } : {}),
  };

  const response = await db.send(new QueryCommand(params));
  return {
    items: (response.Items ?? []) as Record<string, unknown>[],
    lastKey: response.LastEvaluatedKey as Record<string, unknown> | undefined,
  };
}

export async function countUsers() {
  const response = await db.send(
    new QueryCommand({
      TableName: await getTableName(),
      IndexName: 'gsi1',
      KeyConditionExpression: '#model = :model',
      ExpressionAttributeNames: { '#model': 'model' },
      ExpressionAttributeValues: { ':model': 'user' },
      Select: 'COUNT',
    }),
  );
  return response.Count ?? 0;
}

export async function getUserById(id: string) {
  const result = await db.send(
    new GetCommand({
      TableName: await getTableName(),
      Key: { hk: id, sk: 'metadata#' },
    }),
  );
  return result.Item as Record<string, unknown> | undefined;
}

export async function updateUser(
  id: string,
  fields: { nickname?: string; status?: string },
) {
  const updateParts: string[] = [];
  const names: Record<string, string> = {};
  const values: Record<string, unknown> = {};

  if ('nickname' in fields) {
    updateParts.push('#nickname = :nickname');
    names['#nickname'] = 'nickname';
    values[':nickname'] = fields.nickname;
  }

  if ('status' in fields) {
    updateParts.push('#status = :status');
    names['#status'] = 'status';
    values[':status'] = fields.status;
  }

  if (updateParts.length === 0) return;

  await db.send(
    new UpdateCommand({
      TableName: await getTableName(),
      Key: { hk: id, sk: 'metadata#' },
      UpdateExpression: `SET ${updateParts.join(', ')}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
    }),
  );
}

export async function deleteUser(id: string) {
  await db.send(
    new DeleteCommand({
      TableName: await getTableName(),
      Key: { hk: id, sk: 'metadata#' },
    }),
  );
}
