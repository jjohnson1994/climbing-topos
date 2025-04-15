'use server';

import { users } from '../models';
import { UserPublicData } from '@climbingtopos/types';

export const patchUser = (
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

  return users.update(userSub, {
    UpdateExpression: `set ${updateExpression}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
  });
};

export const incrementCragCreatedCount = (userSub: string) => {
  return users.update(userSub, {
    UpdateExpression: 'add #cragsCreated :inc',
    ExpressionAttributeNames: {
      '#cragsCreated': 'cragsCreated',
    },
    ExpressionAttributeValues: {
      ':inc': 1,
    },
  });
};

export const incrementRouteCreatedCount = (userSub: string) => {
  return users.update(userSub, {
    UpdateExpression: 'add #routesCreated :inc',
    ExpressionAttributeNames: {
      '#routesCreated': 'routesCreated',
    },
    ExpressionAttributeValues: {
      ':inc': 1,
    },
  });
};

export const incrementRoutesCompletedCount = (userSub: string) => {
  return users.update(userSub, {
    UpdateExpression: 'add #routesCompleted :inc',
    ExpressionAttributeNames: {
      '#routesCompleted': 'routesCompleted',
    },
    ExpressionAttributeValues: {
      ':inc': 1,
    },
  });
};
