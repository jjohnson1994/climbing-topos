import 'server-only';
import { cookies } from 'next/headers';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

function resolveDevTableName(): string {
  const sstResource = process.env['SST_RESOURCE_climbingtopos2'];
  if (sstResource) {
    try {
      return (JSON.parse(sstResource) as { name: string }).name;
    } catch {}
  }
  return process.env.DYNAMODB_TABLE ?? 'climbingtopos2';
}

const DEV_TABLE_NAME = resolveDevTableName();

export async function getTableName(): Promise<string> {
  const cookieStore = await cookies();
  const env = cookieStore.get('admin_environment')?.value ?? 'dev';
  if (env === 'production') {
    const prodTable = process.env.PRODUCTION_TABLE_NAME;
    if (!prodTable) throw new Error('PRODUCTION_TABLE_NAME is not set in .env.local');
    return prodTable;
  }
  return DEV_TABLE_NAME;
}

const client = new DynamoDBClient({
  region: process.env.AWS_REGION ?? 'eu-west-1',
});

export const db = DynamoDBDocumentClient.from(client);
