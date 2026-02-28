import 'server-only';
import {
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { db, getTableName } from '../db';

export async function listAreas(limit = 50, lastKey?: Record<string, unknown>) {
  const params = {
    TableName: await getTableName(),
    IndexName: 'gsi1',
    KeyConditionExpression: '#model = :model',
    ExpressionAttributeNames: { '#model': 'model' },
    ExpressionAttributeValues: { ':model': 'area' },
    Limit: limit,
    ...(lastKey ? { ExclusiveStartKey: lastKey } : {}),
  };

  const response = await db.send(new QueryCommand(params));
  return {
    items: (response.Items ?? []) as Record<string, unknown>[],
    lastKey: response.LastEvaluatedKey as Record<string, unknown> | undefined,
  };
}

export async function countAreas() {
  const response = await db.send(
    new QueryCommand({
      TableName: await getTableName(),
      IndexName: 'gsi1',
      KeyConditionExpression: '#model = :model',
      ExpressionAttributeNames: { '#model': 'model' },
      ExpressionAttributeValues: { ':model': 'area' },
      Select: 'COUNT',
    }),
  );
  return response.Count ?? 0;
}

export async function getAreaBySlug(slug: string) {
  const response = await db.send(
    new QueryCommand({
      TableName: await getTableName(),
      IndexName: 'gsi2',
      KeyConditionExpression: '#model = :model AND #slug = :slug',
      ExpressionAttributeNames: { '#model': 'model', '#slug': 'slug' },
      ExpressionAttributeValues: { ':model': 'area', ':slug': slug },
    }),
  );
  return response.Items?.[0] as Record<string, unknown> | undefined;
}

export async function getAreasByCrag(cragSlug: string) {
  const response = await db.send(
    new QueryCommand({
      TableName: await getTableName(),
      KeyConditionExpression: '#hk = :hk AND begins_with(#sk, :sk)',
      ExpressionAttributeNames: { '#hk': 'hk', '#sk': 'sk' },
      ExpressionAttributeValues: { ':hk': cragSlug, ':sk': 'area#' },
    }),
  );
  return (response.Items ?? []) as Record<string, unknown>[];
}

const ALLOWED_AREA_FIELDS = new Set([
  'title', 'description', 'access', 'accessDetails',
  'approachNotes', 'rockType', 'latitude', 'longitude', 'verified',
]);

export async function updateArea(
  hk: string,
  sk: string,
  fields: Record<string, unknown>,
) {
  const updateParts: string[] = [];
  const names: Record<string, string> = {};
  const values: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(fields)) {
    if (!ALLOWED_AREA_FIELDS.has(key)) continue;
    updateParts.push(`#${key} = :${key}`);
    names[`#${key}`] = key;
    values[`:${key}`] = value;
  }

  if (updateParts.length === 0) return;

  await db.send(
    new UpdateCommand({
      TableName: await getTableName(),
      Key: { hk, sk },
      UpdateExpression: `SET ${updateParts.join(', ')}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
    }),
  );
}

export async function deleteArea(hk: string, sk: string) {
  await db.send(
    new DeleteCommand({
      TableName: await getTableName(),
      Key: { hk, sk },
    }),
  );
}
