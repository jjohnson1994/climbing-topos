import { nanoid } from 'nanoid';
import { DateTime } from 'luxon';
import { Resource } from 'sst';

import { UserPublicData, Log, LogRequest } from '@climbingtopos/types';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  PutCommand,
  QueryCommand,
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
  cragSlug: string,
  areaSlug?: string,
  topoSlug?: string,
  routeSlug?: string,
): Promise<Log[]> {
  // Build sk pattern matching the actual data structure:
  // sk = log#area#{areaSlug}#topo#{topoSlug}#route#{routeSlug}#{logId}
  let sk = 'log#';

  if (areaSlug) {
    sk += `area#${areaSlug}#`;
  }

  if (areaSlug && topoSlug) {
    sk += `topo#${topoSlug}#`;
  }

  if (areaSlug && topoSlug && routeSlug) {
    sk += `route#${routeSlug}#`;
  }

  const params = {
    TableName: Resource.climbingtopos2.name,
    KeyConditionExpression: '#hk = :hk AND begins_with(#sk, :sk)',
    ProjectionExpression:
      '#slug, #dateSent, #attempts, #comment, #rating, #grade, #gradeTaken, #gradingSystem, #routeSlug, #routeTitle, #user, #cragTitle, #areaTitle',
    ExpressionAttributeNames: {
      '#hk': 'hk',
      '#sk': 'sk',
      '#slug': 'slug',
      '#dateSent': 'dateSent',
      '#attempts': 'attempts',
      '#comment': 'comment',
      '#rating': 'rating',
      '#grade': 'grade',
      '#gradeTaken': 'gradeTaken',
      '#gradingSystem': 'gradingSystem',
      '#routeSlug': 'routeSlug',
      '#routeTitle': 'routeTitle',
      '#user': 'user',
      '#cragTitle': 'cragTitle',
      '#areaTitle': 'areaTitle',
    },
    ExpressionAttributeValues: {
      ':hk': cragSlug,
      ':sk': sk,
    },
  };

  const response = await dynamodb.send(new QueryCommand(params));

  return response?.Items as Log[];
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
    ProjectionExpression:
      '#slug, #dateSent, #attempts, #comment, #rating, #grade, #gradeTaken, #gradingSystem, #routeSlug, #routeTitle, #user, #cragTitle, #cragSlug, #areaTitle, #areaSlug, #topoSlug',
    ExpressionAttributeNames: {
      '#hk': 'hk',
      '#sk': 'sk',
      '#slug': 'slug',
      '#dateSent': 'dateSent',
      '#attempts': 'attempts',
      '#comment': 'comment',
      '#rating': 'rating',
      '#grade': 'grade',
      '#gradeTaken': 'gradeTaken',
      '#gradingSystem': 'gradingSystem',
      '#routeSlug': 'routeSlug',
      '#routeTitle': 'routeTitle',
      '#user': 'user',
      '#cragTitle': 'cragTitle',
      '#cragSlug': 'cragSlug',
      '#areaTitle': 'areaTitle',
      '#areaSlug': 'areaSlug',
      '#topoSlug': 'topoSlug',
    },
    ExpressionAttributeValues: {
      ':hk': `user#${userSub}`,
      ':sk': queryString,
    },
  };

  const response = await dynamodb.send(new QueryCommand(params));

  return response?.Items as Log[];
}
