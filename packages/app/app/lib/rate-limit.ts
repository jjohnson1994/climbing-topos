'server-only';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  GetCommand,
  PutCommand,
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
};

interface RateLimitRecord {
  hk: string;
  sk: string;
  model: string;
  attempts: number;
  windowStart: string;
  expiresAt: number;
}

/**
 * Check if a rate limit has been exceeded
 * @param type - The type of rate limit to check
 * @param identifier - The unique identifier (email or IP address)
 * @returns An object with isLimited and remaining attempts
 * @throws Error if rate limit is exceeded
 */
export async function checkRateLimit(
  type: RateLimitType,
  identifier: string,
): Promise<{ isLimited: boolean; remaining: number; resetAt?: DateTime }> {
  const config = RATE_LIMIT_CONFIGS[type];
  const key = getRateLimitKey(type, identifier);

  const result = await dynamodb.send(
    new GetCommand({
      TableName: Resource.climbingtopos2.name,
      Key: {
        hk: key,
        sk: 'metadata#',
      },
    }),
  );

  const now = DateTime.utc();
  const record = result.Item as RateLimitRecord | undefined;

  if (!record) {
    // No record exists, user is not rate limited
    return { isLimited: false, remaining: config.maxAttempts };
  }

  const windowStart = DateTime.fromISO(record.windowStart);
  const windowEnd = windowStart.plus({ minutes: config.windowMinutes });

  // Check if we're still within the window
  if (now < windowEnd) {
    const remaining = config.maxAttempts - record.attempts;

    if (record.attempts >= config.maxAttempts) {
      return {
        isLimited: true,
        remaining: 0,
        resetAt: windowEnd,
      };
    }

    return {
      isLimited: false,
      remaining: remaining > 0 ? remaining : 0,
      resetAt: windowEnd,
    };
  }

  // Window has expired, user is not rate limited
  return { isLimited: false, remaining: config.maxAttempts };
}

/**
 * Record a rate limit attempt
 * @param type - The type of rate limit
 * @param identifier - The unique identifier (email or IP address)
 */
export async function recordAttempt(
  type: RateLimitType,
  identifier: string,
): Promise<void> {
  const config = RATE_LIMIT_CONFIGS[type];
  const key = getRateLimitKey(type, identifier);
  const now = DateTime.utc();

  const result = await dynamodb.send(
    new GetCommand({
      TableName: Resource.climbingtopos2.name,
      Key: {
        hk: key,
        sk: 'metadata#',
      },
    }),
  );

  const record = result.Item as RateLimitRecord | undefined;

  if (!record) {
    // Create new rate limit record
    const expiresAt = Math.floor(
      now.plus({ minutes: config.windowMinutes + 5 }).toSeconds(),
    );

    await dynamodb.send(
      new PutCommand({
        TableName: Resource.climbingtopos2.name,
        Item: {
          hk: key,
          sk: 'metadata#',
          model: 'rate-limit',
          attempts: 1,
          windowStart: now.toISO(),
          expiresAt, // TTL for automatic cleanup
        },
      }),
    );
    return;
  }

  const windowStart = DateTime.fromISO(record.windowStart);
  const windowEnd = windowStart.plus({ minutes: config.windowMinutes });

  if (now >= windowEnd) {
    // Window has expired, start a new window
    const expiresAt = Math.floor(
      now.plus({ minutes: config.windowMinutes + 5 }).toSeconds(),
    );

    await dynamodb.send(
      new PutCommand({
        TableName: Resource.climbingtopos2.name,
        Item: {
          hk: key,
          sk: 'metadata#',
          model: 'rate-limit',
          attempts: 1,
          windowStart: now.toISO(),
          expiresAt,
        },
      }),
    );
    return;
  }

  // Increment attempts within current window
  await dynamodb.send(
    new UpdateCommand({
      TableName: Resource.climbingtopos2.name,
      Key: {
        hk: key,
        sk: 'metadata#',
      },
      UpdateExpression: 'SET #attempts = #attempts + :inc',
      ExpressionAttributeNames: {
        '#attempts': 'attempts',
      },
      ExpressionAttributeValues: {
        ':inc': 1,
      },
    }),
  );
}

/**
 * Clear rate limit for a user (e.g., after successful login)
 * @param type - The type of rate limit
 * @param identifier - The unique identifier (email or IP address)
 */
export async function clearRateLimit(
  type: RateLimitType,
  identifier: string,
): Promise<void> {
  const key = getRateLimitKey(type, identifier);

  await dynamodb.send(
    new DeleteCommand({
      TableName: Resource.climbingtopos2.name,
      Key: {
        hk: key,
        sk: 'metadata#',
      },
    }),
  );
}

/**
 * Generate a rate limit key
 */
function getRateLimitKey(type: RateLimitType, identifier: string): string {
  // Normalize email addresses to lowercase
  const normalizedIdentifier = identifier.toLowerCase().trim();
  return `ratelimit-${type}-${normalizedIdentifier}`;
}

/**
 * Enforce rate limit - throws error if exceeded
 */
export async function enforceRateLimit(
  type: RateLimitType,
  identifier: string,
): Promise<void> {
  const result = await checkRateLimit(type, identifier);

  if (result.isLimited) {
    const minutesUntilReset = result.resetAt
      ? Math.ceil(result.resetAt.diff(DateTime.utc(), 'minutes').minutes)
      : 15;

    throw new Error(
      `Too many attempts. Please try again in ${minutesUntilReset} minute${minutesUntilReset !== 1 ? 's' : ''}.`,
    );
  }
}
