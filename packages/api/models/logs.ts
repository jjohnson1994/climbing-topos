import { nanoid } from 'nanoid';
import { DateTime } from 'luxon';
import { Resource } from 'sst';

import { UserPublicData, Log, LogRequest } from '@climbingtopos/types';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  PutCommand,
  QueryCommand,
  UpdateCommand,
  DynamoDBDocumentClient,
} from '@aws-sdk/lib-dynamodb';

const dynamodb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export async function createRouteLog(
  logRequest: LogRequest,
  user: UserPublicData,
) {
  const date = DateTime.utc().toString();
  const cragLogSlug = nanoid();
  const userLogSlug = nanoid();

  const logData: LogRequest = {
    areaSlug: logRequest.areaSlug,
    areaTitle: logRequest.areaTitle,
    attempts: logRequest.attempts,
    comment: logRequest.comment,
    country: logRequest.country,
    countryCode: logRequest.countryCode,
    county: logRequest.county,
    cragSlug: logRequest.cragSlug,
    cragTitle: logRequest.cragTitle,
    dateSent: logRequest.dateSent,
    grade: logRequest.grade,
    gradeModal: logRequest.gradeModal,
    gradeTaken: logRequest.gradeTaken,
    gradingSystem: logRequest.gradingSystem,
    rating: logRequest.rating,
    region: logRequest.region,
    rockType: logRequest.rockType,
    routeSlug: logRequest.routeSlug,
    routeTitle: logRequest.routeTitle,
    routeType: logRequest.routeType,
    state: logRequest.state,
    tags: logRequest.tags,
    topoSlug: logRequest.topoSlug,
  };

  const cragLogParams = {
    TableName: Resource.climbingtopos2.name,
    Item: {
      hk: logRequest.cragSlug,
      sk: `log#area#${logRequest.areaSlug}#topo#${logRequest.topoSlug}#route#${logRequest.routeSlug}#${cragLogSlug}`,
      ...logData,
      model: 'log',
      slug: userLogSlug,
      user: {
        nickname: user.nickname,
        sub: user.sub,
        picture: user.picture,
      },
      createdAt: date,
      updatedAt: date,
    },
  };

  const userLogParams = {
    TableName: Resource.climbingtopos2.name,
    Item: {
      hk: `user#${user.sub}`,
      sk: `log#crag#${logRequest.cragSlug}#area#${logRequest.areaSlug}#topo#${logRequest.topoSlug}#route#${logRequest.routeSlug}#${userLogSlug}`,
      ...logData,
      model: 'log',
      slug: userLogSlug,
      user: {
        nickname: user.nickname,
        sub: user.sub,
        picture: user.picture,
      },
      createdAt: date,
      updatedAt: date,
    },
  };

  await Promise.all([
    dynamodb.send(new PutCommand(cragLogParams)),
    dynamodb.send(new PutCommand(userLogParams)),
  ]);
}

export async function getLogs(
  cragSlug?: string,
  areaSlug?: string,
  topoSlug?: string,
  routeSlug?: string,
): Promise<Log[]> {
  let sk = 'log#';

  if (cragSlug) {
    sk += `crag#${cragSlug}#`;
  }

  if (cragSlug && areaSlug) {
    sk += `area#${areaSlug}#`;
  }

  if (cragSlug && areaSlug && topoSlug) {
    sk += `topo#${topoSlug}#`;
  }

  if (cragSlug && areaSlug && topoSlug && routeSlug) {
    sk += `route#${routeSlug}`;
  }

  const params = {
    TableName: Resource.climbingtopos2.name,
    IndexName: 'gsi1',
    KeyConditionExpression: '#hk = :hk AND begins_with(#sk, :sk)',
    ExpressionAttributeNames: {
      '#hk': 'model',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':hk': 'log',
      ':sk': sk,
    },
  };

  const response = await dynamodb.send(new QueryCommand(params));

  return response?.Items as Log[];
}

interface CragLog extends Log {
  hk: string;
  sk: string;
  user: { sub: string; nickname: string; picture: string };
}

export async function getLogsForRoute(
  cragSlug: string,
  areaSlug: string,
  topoSlug: string,
  routeSlug: string,
): Promise<CragLog[]> {
  const allLogs: CragLog[] = [];
  let lastEvaluatedKey: Record<string, any> | undefined;

  do {
    const params: any = {
      TableName: Resource.climbingtopos2.name,
      KeyConditionExpression: '#hk = :hk AND begins_with(#sk, :sk)',
      ExpressionAttributeNames: { '#hk': 'hk', '#sk': 'sk' },
      ExpressionAttributeValues: {
        ':hk': cragSlug,
        ':sk': `log#area#${areaSlug}#topo#${topoSlug}#route#${routeSlug}#`,
      },
    };

    if (lastEvaluatedKey) {
      params.ExclusiveStartKey = lastEvaluatedKey;
    }

    const response = await dynamodb.send(new QueryCommand(params));
    allLogs.push(...((response.Items as CragLog[]) ?? []));
    lastEvaluatedKey = response.LastEvaluatedKey;
  } while (lastEvaluatedKey);

  return allLogs;
}

export async function updateLog(
  hk: string,
  sk: string,
  fields: Record<string, any>,
) {
  const expressionAttributeNames = Object.keys(fields).reduce(
    (acc, key) => ({ ...acc, [`#${key}`]: key }),
    {} as Record<string, string>,
  );
  const expressionAttributeValues = Object.entries(fields).reduce(
    (acc, [key, value]) => ({ ...acc, [`:${key}`]: value }),
    {} as Record<string, any>,
  );
  const updateExpression = Object.keys(fields)
    .map((key) => `#${key} = :${key}`)
    .join(', ');

  return dynamodb.send(
    new UpdateCommand({
      TableName: Resource.climbingtopos2.name,
      Key: { hk, sk },
      UpdateExpression: `set ${updateExpression}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    }),
  );
}

export async function getLogsForUser(
  userSub: string,
  cragSlug?: string,
  areaSlug?: string,
  topoSlug?: string,
  routeSlug?: string,
): Promise<Log[]> {
  let queryString = `log#`;

  if (cragSlug) {
    queryString += `crag#${cragSlug}#`;
  }

  if (cragSlug && areaSlug) {
    queryString += `area#${areaSlug}#`;
  }

  if (cragSlug && areaSlug && topoSlug) {
    queryString += `topo#${topoSlug}#`;
  }

  if (cragSlug && areaSlug && topoSlug && routeSlug) {
    queryString += `route#${routeSlug}#`;
  }

  const params = {
    TableName: Resource.climbingtopos2.name,
    KeyConditionExpression: '#hk = :hk AND begins_with(#sk, :sk)',
    ExpressionAttributeNames: {
      '#hk': 'hk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':hk': `user#${userSub}`,
      ':sk': queryString,
    },
  };

  const response = await dynamodb.send(new QueryCommand(params));

  return response?.Items as Log[];
}
