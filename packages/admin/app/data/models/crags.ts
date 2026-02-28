import 'server-only';
import {
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { db, getTableName } from '../db';

export async function listCrags(limit = 50, lastKey?: Record<string, unknown>) {
  const params = {
    TableName: await getTableName(),
    IndexName: 'gsi1',
    KeyConditionExpression: '#model = :model',
    ExpressionAttributeNames: { '#model': 'model' },
    ExpressionAttributeValues: { ':model': 'crag' },
    Limit: limit,
    ...(lastKey ? { ExclusiveStartKey: lastKey } : {}),
  };

  const response = await db.send(new QueryCommand(params));
  return {
    items: (response.Items ?? []) as Record<string, unknown>[],
    lastKey: response.LastEvaluatedKey as Record<string, unknown> | undefined,
  };
}

export async function countCrags() {
  const response = await db.send(
    new QueryCommand({
      TableName: await getTableName(),
      IndexName: 'gsi1',
      KeyConditionExpression: '#model = :model',
      ExpressionAttributeNames: { '#model': 'model' },
      ExpressionAttributeValues: { ':model': 'crag' },
      Select: 'COUNT',
    }),
  );
  return response.Count ?? 0;
}

export async function getCragBySlug(slug: string) {
  const response = await db.send(
    new QueryCommand({
      TableName: await getTableName(),
      KeyConditionExpression: '#hk = :hk AND #sk = :sk',
      ExpressionAttributeNames: { '#hk': 'hk', '#sk': 'sk' },
      ExpressionAttributeValues: { ':hk': slug, ':sk': 'metadata#' },
    }),
  );
  return response.Items?.[0] as Record<string, unknown> | undefined;
}

const ALLOWED_CRAG_FIELDS = new Set([
  'title', 'description', 'access', 'accessDetails', 'accessLink',
  'approachNotes', 'latitude', 'longitude', 'verified',
]);

export async function updateCrag(slug: string, fields: Record<string, unknown>) {
  const updateParts: string[] = [];
  const names: Record<string, string> = {};
  const values: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(fields)) {
    if (!ALLOWED_CRAG_FIELDS.has(key)) continue;
    updateParts.push(`#${key} = :${key}`);
    names[`#${key}`] = key;
    values[`:${key}`] = value;
  }

  if (updateParts.length === 0) return;

  await db.send(
    new UpdateCommand({
      TableName: await getTableName(),
      Key: { hk: slug, sk: 'metadata#' },
      UpdateExpression: `SET ${updateParts.join(', ')}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
    }),
  );
}

export async function deleteCrag(slug: string) {
  await db.send(
    new DeleteCommand({
      TableName: await getTableName(),
      Key: { hk: slug, sk: 'metadata#' },
    }),
  );
}

export async function updateCragImage(slug: string, imageUrl: string) {
  await db.send(
    new UpdateCommand({
      TableName: await getTableName(),
      Key: { hk: slug, sk: 'metadata#' },
      UpdateExpression: 'SET #image = :image',
      ExpressionAttributeNames: { '#image': 'image' },
      ExpressionAttributeValues: { ':image': imageUrl },
    }),
  );
}
