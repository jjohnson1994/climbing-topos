import { update, getUserByEmail } from '@/data/models/users';
import { UserPublicData } from '@climbingtopos/types';
import { DateTime } from 'luxon';
import bcrypt from 'bcryptjs';

export const verifyUser = async (email: string, verificationCode: number) => {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new Error('User not found');
  }

  if (DateTime.fromISO(user.verificationCodeExpiration) < DateTime.utc()) {
    throw new Error('Verification code expired');
  }

  if (user.verificationCode !== verificationCode) {
    throw new Error('Verification code mismatch');
  }

  try {
    await update(user.id, {
      UpdateExpression:
        'SET #status = :status REMOVE #verificationCode, #verificationCodeExpiration',
      ExpressionAttributeNames: {
        '#status': 'status',
        '#verificationCode': 'verificationCode',
        '#verificationCodeExpiration': 'verificationCodeExpiration',
      },
      ExpressionAttributeValues: {
        ':status': 'verified',
      },
      ConditionExpression: 'attribute_exists(#verificationCode)',
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === 'ConditionalCheckFailedException'
    ) {
      throw new Error('Verification code mismatch');
    }
    throw error;
  }

  return {
    id: user.id,
    sub: user.id,
    email: user.email,
    nickname: user.nickname,
    picture: user.picture,
    status: 'verified' as const,
    tokenVersion: (user.tokenVersion as number | undefined) ?? 0,
  };
};

const TIMING_EQUALIZER_HASH =
  '$2b$10$D9J9j8S7ji7ps0LUKKob3OUqfH0EmQR6B9Seck.h6NhO6KIYxgb5i';

export const verifyLogin = async (email: string, password: string) => {
  const GENERIC_ERROR = 'Invalid email or password. Please try again or reset your password.';

  if (!password) {
    throw new Error(GENERIC_ERROR);
  }

  const user = await getUserByEmail(email);

  if (!user || !user.hashedPassword) {
    await bcrypt.compare(password, TIMING_EQUALIZER_HASH);
    throw new Error(GENERIC_ERROR);
  }

  const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

  if (!passwordMatch) {
    throw new Error(GENERIC_ERROR);
  }

  return {
    id: user.id,
    sub: user.id,
    email: user.email,
    nickname: user.nickname,
    picture: user.picture,
    status: user.status,
    tokenVersion: (user.tokenVersion as number | undefined) ?? 0,
  };
};

export const patchUser = async (
  userSub: string,
  patch: Pick<UserPublicData, 'picture' | 'nickname'>,
) => {
  const expressionAttributeNames = Object.entries(patch).reduce(
    (acc, [key]) => ({
      ...acc,
      [`#${key}`]: key,
    }),
    {},
  );

  const expressionAttributeValues = Object.entries(patch).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [`:${key}`]: value,
    }),
    {},
  );

  const updateExpression = Object.entries(patch)
    .map(([key]) => {
      return `#${key} = :${key}`;
    })
    .join(', ');

  return update(userSub, {
    UpdateExpression: `set ${updateExpression}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
  });
};

export const incrementCragCreatedCount = async (userSub: string) => {
  return update(userSub, {
    UpdateExpression: 'add #cragsCreated :inc',
    ExpressionAttributeNames: {
      '#cragsCreated': 'cragsCreated',
    },
    ExpressionAttributeValues: {
      ':inc': 1,
    },
  });
};

export const incrementRouteCreatedCount = async (userSub: string) => {
  return update(userSub, {
    UpdateExpression: 'add #routesCreated :inc',
    ExpressionAttributeNames: {
      '#routesCreated': 'routesCreated',
    },
    ExpressionAttributeValues: {
      ':inc': 1,
    },
  });
};

export const incrementRoutesCompletedCount = async (userSub: string) => {
  return update(userSub, {
    UpdateExpression: 'add #routesCompleted :inc',
    ExpressionAttributeNames: {
      '#routesCompleted': 'routesCompleted',
    },
    ExpressionAttributeValues: {
      ':inc': 1,
    },
  });
};
