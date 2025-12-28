'use server';

import { update, getUserByEmail } from '@/app/data/models/users';
import { UserPublicData } from '@climbingtopos/types';
import { DateTime } from 'luxon';
import bcrypt from 'bcrypt';

export const verifyUser = async (email: string, verificationCode: number) => {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new Error('User not found');
  }

  if (user.verificationCode !== verificationCode) {
    throw new Error('Verification code mismatch');
  }

  if (DateTime.fromISO(user.verificationCodeExpiration) < DateTime.utc()) {
    throw new Error('Verification code expired');
  }

  await patchUser(user.id, { status: 'verified' });

  return {
    id: user.id,
    sub: user.id,
    email: user.email,
    nickname: user.nickname,
    picture: user.picture,
    status: 'verified',
  };
};

export const verifyLogin = async (email: string, password: string) => {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new Error('User not found');
  }

  const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

  if (!passwordMatch) {
    throw new Error('invalid password');
  }

  return {
    id: user.id,
    sub: user.id,
    email: user.email,
    nickname: user.nickname,
    picture: user.picture,
    status: user.status,
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
