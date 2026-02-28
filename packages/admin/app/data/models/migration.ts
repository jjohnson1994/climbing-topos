import 'server-only';
import { ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { db, getTableName } from '../db';

export type FieldChange = {
  field: string;
  from: string;
  to: string;
};

export type UpdatePlan = {
  hk: string;
  sk: string;
  model: string;
  changes: FieldChange[];
  recentLogsUpdate?: Array<Record<string, unknown>>;
};

function rewriteUrl(url: string, s3Prefix: string, cdnUrl: string): string {
  return `${cdnUrl}/${url.slice(s3Prefix.length)}`;
}

function planItemUpdates(
  item: Record<string, unknown>,
  s3Prefix: string,
  cdnUrl: string,
): UpdatePlan | null {
  const changes: FieldChange[] = [];
  let recentLogsUpdate: Array<Record<string, unknown>> | undefined;

  if (typeof item.image === 'string' && item.image.startsWith(s3Prefix)) {
    changes.push({ field: 'image', from: item.image, to: rewriteUrl(item.image, s3Prefix, cdnUrl) });
  }

  if (typeof item.picture === 'string' && item.picture.startsWith(s3Prefix)) {
    changes.push({ field: 'picture', from: item.picture, to: rewriteUrl(item.picture, s3Prefix, cdnUrl) });
  }

  const createdBy = item.createdBy as Record<string, unknown> | undefined;
  if (typeof createdBy?.picture === 'string' && createdBy.picture.startsWith(s3Prefix)) {
    changes.push({ field: 'createdBy.picture', from: createdBy.picture, to: rewriteUrl(createdBy.picture, s3Prefix, cdnUrl) });
  }

  const managedBy = item.managedBy as Record<string, unknown> | undefined;
  if (typeof managedBy?.picture === 'string' && managedBy.picture.startsWith(s3Prefix)) {
    changes.push({ field: 'managedBy.picture', from: managedBy.picture, to: rewriteUrl(managedBy.picture, s3Prefix, cdnUrl) });
  }

  const user = item.user as Record<string, unknown> | undefined;
  if (typeof user?.picture === 'string' && user.picture.startsWith(s3Prefix)) {
    changes.push({ field: 'user.picture', from: user.picture, to: rewriteUrl(user.picture, s3Prefix, cdnUrl) });
  }

  if (Array.isArray(item.recentLogs)) {
    const logs = item.recentLogs as Array<Record<string, unknown>>;
    let hasChanges = false;
    const updatedLogs = logs.map((log) => {
      if (typeof log.picture === 'string' && log.picture.startsWith(s3Prefix)) {
        hasChanges = true;
        return { ...log, picture: rewriteUrl(log.picture, s3Prefix, cdnUrl) };
      }
      return log;
    });
    if (hasChanges) {
      recentLogsUpdate = updatedLogs;
      changes.push({ field: 'recentLogs[].picture', from: `(${logs.length} entries)`, to: '(updated)' });
    }
  }

  if (changes.length === 0) return null;

  return {
    hk: String(item.hk),
    sk: String(item.sk),
    model: String(item.model ?? 'unknown'),
    changes,
    recentLogsUpdate,
  };
}

export async function scanForUpdates(s3Prefix: string, cdnUrl: string): Promise<UpdatePlan[]> {
  const tableName = await getTableName();
  const plans: UpdatePlan[] = [];
  let lastKey: Record<string, unknown> | undefined;

  do {
    const response = await db.send(
      new ScanCommand({
        TableName: tableName,
        ConsistentRead: true,
        ...(lastKey ? { ExclusiveStartKey: lastKey } : {}),
      }),
    );

    for (const item of response.Items ?? []) {
      const plan = planItemUpdates(item as Record<string, unknown>, s3Prefix, cdnUrl);
      if (plan) plans.push(plan);
    }

    lastKey = response.LastEvaluatedKey as Record<string, unknown> | undefined;
  } while (lastKey);

  return plans;
}

export async function applyUpdates(
  plans: UpdatePlan[],
): Promise<{ succeeded: number; failed: number; errors: string[] }> {
  const tableName = await getTableName();
  let succeeded = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const plan of plans) {
    try {
      const setParts: string[] = [];
      const names: Record<string, string> = {};
      const values: Record<string, unknown> = {};

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
          case 'recentLogs[].picture':
            break;
        }
      }

      if (plan.recentLogsUpdate) {
        setParts.push('#recentLogs = :recentLogs');
        names['#recentLogs'] = 'recentLogs';
        values[':recentLogs'] = plan.recentLogsUpdate;
      }

      if (setParts.length === 0) continue;

      await db.send(
        new UpdateCommand({
          TableName: tableName,
          Key: { hk: plan.hk, sk: plan.sk },
          UpdateExpression: `SET ${setParts.join(', ')}`,
          ExpressionAttributeNames: names,
          ExpressionAttributeValues: values,
        }),
      );

      succeeded++;
    } catch (err) {
      failed++;
      errors.push(`${plan.hk} / ${plan.sk}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return { succeeded, failed, errors };
}
