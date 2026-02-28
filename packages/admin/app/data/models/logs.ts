import 'server-only';
import { QueryCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { db, getTableName } from '../db';

export async function listLogs(limit = 50, lastKey?: Record<string, unknown>) {
  const params = {
    TableName: await getTableName(),
    IndexName: 'gsi1',
    KeyConditionExpression: '#model = :model',
    ExpressionAttributeNames: { '#model': 'model' },
    ExpressionAttributeValues: { ':model': 'log' },
    Limit: limit,
    ...(lastKey ? { ExclusiveStartKey: lastKey } : {}),
  };

  const response = await db.send(new QueryCommand(params));
  return {
    items: (response.Items ?? []) as Record<string, unknown>[],
    lastKey: response.LastEvaluatedKey as Record<string, unknown> | undefined,
  };
}

export async function countLogs() {
  const response = await db.send(
    new QueryCommand({
      TableName: await getTableName(),
      IndexName: 'gsi1',
      KeyConditionExpression: '#model = :model',
      ExpressionAttributeNames: { '#model': 'model' },
      ExpressionAttributeValues: { ':model': 'log' },
      Select: 'COUNT',
    }),
  );
  return response.Count ?? 0;
}

export async function deleteLog(hk: string, sk: string) {
  await db.send(
    new DeleteCommand({
      TableName: await getTableName(),
      Key: { hk, sk },
    }),
  );
}
