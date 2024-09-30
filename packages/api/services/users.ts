import { users } from '../models';

export const incrementCragCreatedCount = (userSub: string) => {
  return users.update(userSub, {
    UpdateExpression: "add #cragsCreated :inc",
    ExpressionAttributeNames: {
      "#cragsCreated": "cragsCreated",
    },
    ExpressionAttributeValues: {
      ":inc": 1,
    },
  });
}

export const incrementRouteCreatedCount = (userSub: string) => {
  return users.update(userSub, {
    UpdateExpression: "add #routesCreated :inc",
    ExpressionAttributeNames: {
      "#routesCreated": "routesCreated",
    },
    ExpressionAttributeValues: {
      ":inc": 1,
    },
  });
}

export const incrementRoutesCompletedCount = (userSub: string) => {
  return users.update(userSub, {
    UpdateExpression: "add #routesCompleted :inc",
    ExpressionAttributeNames: {
      "#routesCompleted": "routesCompleted",
    },
    ExpressionAttributeValues: {
      ":inc": 1,
    },
  });
}
