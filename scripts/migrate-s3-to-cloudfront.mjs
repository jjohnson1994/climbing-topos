#!/usr/bin/env node
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { createInterface } from 'readline';

const TABLE_NAME = process.env.DYNAMODB_TABLE ?? 'climbingtopos2';
const S3_PREFIX = process.env.S3_PREFIX;
const CDN_URL = process.env.CDN_URL?.replace(/\/$/, '');

if (!S3_PREFIX || !CDN_URL) {
  console.error('Usage: S3_PREFIX=https://<bucket>.s3.<region>.amazonaws.com/ CDN_URL=https://<dist>.cloudfront.net node scripts/migrate-s3-to-cloudfront.mjs');
  process.exit(1);
}

const db = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: process.env.AWS_REGION ?? 'eu-west-1' }),
);

function rewrite(url) {
  return `${CDN_URL}/${url.slice(S3_PREFIX.length)}`;
}

function planItem(item) {
  const changes = [];
  let recentLogsUpdate;

  if (typeof item.image === 'string' && item.image.startsWith(S3_PREFIX))
    changes.push({ field: 'image', to: rewrite(item.image) });

  if (typeof item.picture === 'string' && item.picture.startsWith(S3_PREFIX))
    changes.push({ field: 'picture', to: rewrite(item.picture) });

  if (typeof item.createdBy?.picture === 'string' && item.createdBy.picture.startsWith(S3_PREFIX))
    changes.push({ field: 'createdBy.picture', to: rewrite(item.createdBy.picture) });

  if (typeof item.managedBy?.picture === 'string' && item.managedBy.picture.startsWith(S3_PREFIX))
    changes.push({ field: 'managedBy.picture', to: rewrite(item.managedBy.picture) });

  if (typeof item.user?.picture === 'string' && item.user.picture.startsWith(S3_PREFIX))
    changes.push({ field: 'user.picture', to: rewrite(item.user.picture) });

  if (Array.isArray(item.recentLogs)) {
    let hasChanges = false;
    const updated = item.recentLogs.map((log) => {
      if (typeof log.picture === 'string' && log.picture.startsWith(S3_PREFIX)) {
        hasChanges = true;
        return { ...log, picture: rewrite(log.picture) };
      }
      return log;
    });
    if (hasChanges) {
      recentLogsUpdate = updated;
      changes.push({ field: 'recentLogs[].picture' });
    }
  }

  if (changes.length === 0) return null;
  return { hk: String(item.hk), sk: String(item.sk), model: String(item.model ?? 'unknown'), changes, recentLogsUpdate };
}

async function scan() {
  const plans = [];
  let lastKey;
  process.stdout.write('Scanning');
  do {
    const res = await db.send(new ScanCommand({
      TableName: TABLE_NAME,
      ConsistentRead: true,
      ...(lastKey ? { ExclusiveStartKey: lastKey } : {}),
    }));
    for (const item of res.Items ?? []) {
      const plan = planItem(item);
      if (plan) plans.push(plan);
    }
    lastKey = res.LastEvaluatedKey;
    process.stdout.write('.');
  } while (lastKey);
  console.log(' done.\n');
  return plans;
}

async function apply(plans) {
  let succeeded = 0, failed = 0;
  const errors = [];

  for (const plan of plans) {
    try {
      const setParts = [];
      const names = {};
      const values = {};

      for (const change of plan.changes) {
        switch (change.field) {
          case 'image':
            setParts.push('#image = :image');
            names['#image'] = 'image';
            values[':image'] = change.to;
            break;
          case 'picture':
            setParts.push('#picture = :picture');
            names['#picture'] = 'picture';
            values[':picture'] = change.to;
            break;
          case 'createdBy.picture':
            setParts.push('createdBy.#picture = :cbPicture');
            names['#picture'] = 'picture';
            values[':cbPicture'] = change.to;
            break;
          case 'managedBy.picture':
            setParts.push('managedBy.#picture = :mbPicture');
            names['#picture'] = 'picture';
            values[':mbPicture'] = change.to;
            break;
          case 'user.picture':
            setParts.push('#userAttr.#picture = :userPicture');
            names['#userAttr'] = 'user';
            names['#picture'] = 'picture';
            values[':userPicture'] = change.to;
            break;
        }
      }

      if (plan.recentLogsUpdate) {
        setParts.push('#recentLogs = :recentLogs');
        names['#recentLogs'] = 'recentLogs';
        values[':recentLogs'] = plan.recentLogsUpdate;
      }

      if (setParts.length === 0) continue;

      await db.send(new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { hk: plan.hk, sk: plan.sk },
        UpdateExpression: `SET ${setParts.join(', ')}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
      }));

      succeeded++;
    } catch (err) {
      failed++;
      errors.push(`${plan.hk} / ${plan.sk}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return { succeeded, failed, errors };
}

function prompt(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(question, (ans) => { rl.close(); resolve(ans); }));
}

const plans = await scan();

if (plans.length === 0) {
  console.log('No S3 URLs found — nothing to migrate.');
  process.exit(0);
}

const summary = {};
for (const p of plans) summary[p.model] = (summary[p.model] ?? 0) + 1;

console.log(`Table:      ${TABLE_NAME}`);
console.log(`S3 prefix:  ${S3_PREFIX}`);
console.log(`CDN URL:    ${CDN_URL}`);
console.log(`\nItems to update: ${plans.length}`);
console.log('\nBy model:');
for (const [model, count] of Object.entries(summary)) console.log(`  ${model}: ${count}`);

console.log('\nSample (first 5):');
for (const p of plans.slice(0, 5)) {
  console.log(`  [${p.model}] ${p.hk} — ${p.changes.map(c => c.field).join(', ')}`);
}

const answer = await prompt('\nType MIGRATE to proceed, anything else to abort: ');
if (answer !== 'MIGRATE') {
  console.log('Aborted.');
  process.exit(0);
}

console.log('\nApplying updates…');
const { succeeded, failed, errors } = await apply(plans);
console.log(`\nDone. succeeded=${succeeded} failed=${failed}`);
if (errors.length > 0) {
  console.error('\nErrors:');
  for (const e of errors) console.error(' ', e);
  process.exit(1);
}
