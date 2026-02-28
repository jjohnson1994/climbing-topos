'server-only';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  UpdateCommand,
  DeleteCommand,
  DynamoDBDocumentClient,
} from '@aws-sdk/lib-dynamodb';
import { Resource } from 'sst';
import { DateTime } from 'luxon';

const dynamodb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export enum RateLimitType {
  LOGIN = 'login',
  LOGIN_IP = 'login-ip',
  VERIFICATION = 'verification',
  SIGNUP = 'signup',
  RESEND_CODE = 'resend-code',
  PASSWORD_RESET_REQUEST = 'password-reset-request',
  PASSWORD_RESET_CONFIRM = 'password-reset-confirm',
}

interface RateLimitConfig {
  maxAttempts: number;
  windowMinutes: number;
}

const RATE_LIMIT_CONFIGS: Record<RateLimitType, RateLimitConfig> = {
  [RateLimitType.LOGIN]: { maxAttempts: 5, windowMinutes: 15 },
  [RateLimitType.LOGIN_IP]: { maxAttempts: 20, windowMinutes: 15 },
  [RateLimitType.VERIFICATION]: { maxAttempts: 10, windowMinutes: 15 },
  [RateLimitType.SIGNUP]: { maxAttempts: 5, windowMinutes: 15 },
  [RateLimitType.RESEND_CODE]: { maxAttempts: 3, windowMinutes: 15 },
  [RateLimitType.PASSWORD_RESET_REQUEST]: { maxAttempts: 3, windowMinutes: 15 },
  [RateLimitType.PASSWORD_RESET_CONFIRM]: { maxAttempts: 5, windowMinutes: 15 },
};

function getCurrentWindow(windowMinutes: number): {
  windowBucket: number;
  windowEnd: DateTime;
} {
  const now = DateTime.utc();
  const windowSizeSeconds = windowMinutes * 60;
  const windowBucket = Math.floor(now.toSeconds() / windowSizeSeconds);
  const windowEnd = DateTime.fromSeconds(
    (windowBucket + 1) * windowSizeSeconds,
  );
  return { windowBucket, windowEnd };
}

function getWindowKey(
  type: RateLimitType,
  identifier: string,
  windowBucket: number,
): string {
  const normalizedIdentifier = identifier.toLowerCase().trim();
  return `ratelimit-${type}-${normalizedIdentifier}-${windowBucket}`;
}

export async function enforceRateLimit(
  type: RateLimitType,
  identifier: string,
): Promise<{ windowBucket: number }> {
  const config = RATE_LIMIT_CONFIGS[type];
  const { windowBucket, windowEnd } = getCurrentWindow(config.windowMinutes);
  const windowKey = getWindowKey(type, identifier, windowBucket);
  const expiresAt = Math.floor(windowEnd.plus({ minutes: 5 }).toSeconds());

  const result = await dynamodb.send(
    new UpdateCommand({
      TableName: Resource.climbingtopos2.name,
      Key: {
        hk: windowKey,
        sk: 'metadata#',
      },
      UpdateExpression:
        'ADD #attempts :inc SET #model = if_not_exists(#model, :model), #expiresAt = if_not_exists(#expiresAt, :expiresAt)',
      ExpressionAttributeNames: {
        '#attempts': 'attempts',
        '#model': 'model',
        '#expiresAt': 'expiresAt',
      },
      ExpressionAttributeValues: {
        ':inc': 1,
        ':model': 'rate-limit',
        ':expiresAt': expiresAt,
      },
      ReturnValues: 'ALL_NEW',
    }),
  );

  const newCount = (result.Attributes?.attempts as number) ?? 1;

  if (newCount > config.maxAttempts) {
    throw new Error('Too many attempts. Please try again later.');
  }

  return { windowBucket };
}

export async function clearRateLimit(
  type: RateLimitType,
  identifier: string,
  windowBucket?: number,
): Promise<void> {
  const config = RATE_LIMIT_CONFIGS[type];
  const bucket = windowBucket ?? getCurrentWindow(config.windowMinutes).windowBucket;
  const windowKey = getWindowKey(type, identifier, bucket);

  await dynamodb.send(
    new DeleteCommand({
      TableName: Resource.climbingtopos2.name,
      Key: {
        hk: windowKey,
        sk: 'metadata#',
      },
    }),
  );
}
