import { users } from '../models';

export function incrementContributionCount(userId: string) {
  return users.update(userId, {
    UpdateExpression: "set #contributionCount = #contributionCount + :inc",
    ExpressionAttributeNames: { 
      "#contributionCount": "contributionCount",
    },
    ExpressionAttributeValues: {
      ":inc": 1
    },
  });
}
