import { nanoid } from 'nanoid';
import { DateTime } from 'luxon';
import { Resource } from 'sst';

import {
  UserPublicData,
  List,
  ListRequest,
  ListRoute,
  ListRoutePartial,
} from '@climbingtopos/types';
import { createSlug } from '@/helpers/slug';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  PutCommand,
  UpdateCommand,
  QueryCommand,
  DeleteCommand,
  DynamoDBDocumentClient,
} from '@aws-sdk/lib-dynamodb';

const dynamodb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export async function createList(
  user: UserPublicData,
  listRequest: ListRequest,
) {
  const date = DateTime.utc().toString();
  const slug = createSlug(`${listRequest.title}-${nanoid(5)}`);

  const listData: ListRequest = {
    title: listRequest.title,
  };

  const params = {
    TableName: Resource.climbingtopos2.name,
    Item: {
      hk: `user#${user.sub}`,
      sk: `list#metadata#${slug}`,
      ...listData,
      routeCount: 0,
      model: 'list',
      slug,
      createdBy: user,
      createdAt: date,
      updatedAt: date,
    },
  };

  await dynamodb.send(new PutCommand(params));

  return {
    slug,
  };
}

export async function getListBySlug(
  userSub: string,
  listSlug: string,
): Promise<List> {
  const params = {
    TableName: Resource.climbingtopos2.name,
    KeyConditionExpression: '#hk = :hk AND begins_with(#sk, :sk)',
    ExpressionAttributeNames: {
      '#hk': 'hk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':hk': `user#${userSub}`,
      ':sk': `list#metadata#${listSlug}`,
    },
  };

  const list = await dynamodb.send(new QueryCommand(params));

  return list?.Items?.[0] as List;
}

export async function getListRoutes(
  userSub: string,
  listSlug: string,
): Promise<ListRoute[]> {
  const params = {
    TableName: Resource.climbingtopos2.name,
    KeyConditionExpression: '#hk = :hk AND begins_with(#sk, :sk)',
    ProjectionExpression:
      '#slug, #title, #cragSlug, #cragTitle, #areaSlug, #areaTitle, #topoSlug, #routeSlug, #grade, #gradeModal, #gradingSystem, #routeType, #listSlug',
    ExpressionAttributeNames: {
      '#hk': 'hk',
      '#sk': 'sk',
      '#slug': 'slug',
      '#title': 'title',
      '#cragSlug': 'cragSlug',
      '#cragTitle': 'cragTitle',
      '#areaSlug': 'areaSlug',
      '#areaTitle': 'areaTitle',
      '#topoSlug': 'topoSlug',
      '#routeSlug': 'routeSlug',
      '#grade': 'grade',
      '#gradeModal': 'gradeModal',
      '#gradingSystem': 'gradingSystem',
      '#routeType': 'routeType',
      '#listSlug': 'listSlug',
    },
    ExpressionAttributeValues: {
      ':hk': `user#${userSub}`,
      ':sk': `list#route#${listSlug}#`,
    },
  };

  const listRoutes = await dynamodb.send(new QueryCommand(params));

  return listRoutes.Items as ListRoute[];
}

export async function getUserLists(userSub: string): Promise<List[]> {
  const params = {
    TableName: Resource.climbingtopos2.name,
    KeyConditionExpression: '#hk = :hk AND begins_with(#sk, :sk)',
    ProjectionExpression: '#slug, #title, #routeCount',
    ExpressionAttributeNames: {
      '#hk': 'hk',
      '#sk': 'sk',
      '#slug': 'slug',
      '#title': 'title',
      '#routeCount': 'routeCount',
    },
    ExpressionAttributeValues: {
      ':hk': `user#${userSub}`,
      ':sk': `list#metadata#`,
    },
  };

  const lists = await dynamodb.send(new QueryCommand(params));

  return lists?.Items as List[];
}

export async function addRouteToList(
  userSub: string,
  listSlug: string,
  route: ListRoutePartial,
) {
  const date = DateTime.utc().toString();
  const slug = nanoid();

  const listRoute: ListRoute = {
    ...route,
    listSlug,
    slug,
  };

  const params = {
    TableName: Resource.climbingtopos2.name,
    Item: {
      hk: `user#${userSub}`,
      sk: `list#route#${listSlug}#crag#${listRoute.cragSlug}#area#${listRoute.areaSlug}#topo#${listRoute.topoSlug}#route#${listRoute.routeSlug}`,
      ...listRoute,
      createdBy: userSub,
      model: 'listRoute',
      slug,
      createdAt: date,
      updatedAt: date,
    },
  };

  await dynamodb.send(new PutCommand(params));

  return {
    slug,
  };
}
export async function update(
  listSlug: string,
  userSub: string,
  updateProps: {
    UpdateExpression: string;
    ExpressionAttributeNames: Record<string, string>;
    ExpressionAttributeValues: Record<string, any>;
  },
) {
  const params = {
    TableName: Resource.climbingtopos2.name,
    Key: {
      hk: `user#${userSub}`,
      sk: `list#metadata#${listSlug}`,
    },
    ...updateProps,
  };

  await dynamodb.send(new UpdateCommand(params));
}

export async function getListsContainingRoute(
  userSub: string,
  routeSlug: string,
): Promise<{ listSlug: string; listTitle: string }[]> {
  const params = {
    TableName: Resource.climbingtopos2.name,
    KeyConditionExpression: '#hk = :hk AND begins_with(#sk, :sk)',
    ProjectionExpression: '#listSlug, #listTitle, #routeSlug',
    ExpressionAttributeNames: {
      '#hk': 'hk',
      '#sk': 'sk',
      '#listSlug': 'listSlug',
      '#listTitle': 'listTitle',
      '#routeSlug': 'routeSlug',
    },
    ExpressionAttributeValues: {
      ':hk': `user#${userSub}`,
      ':sk': `list#route#`,
    },
  };

  const response = await dynamodb.send(new QueryCommand(params));
  const allListRoutes = response?.Items || [];

  // Filter to only routes matching this routeSlug
  const matchingLists = allListRoutes
    .filter((item) => item.routeSlug === routeSlug)
    .map((item) => ({
      listSlug: item.listSlug,
      listTitle: item.listTitle,
    }));

  // Remove duplicates (same list might have been returned multiple times)
  const uniqueLists = Array.from(
    new Map(matchingLists.map((list) => [list.listSlug, list])).values(),
  );

  return uniqueLists;
}

export async function removeRouteFromList(
  userSub: string,
  listSlug: string,
  cragSlug: string,
  areaSlug: string,
  topoSlug: string,
  routeSlug: string,
) {
  const params = {
    TableName: Resource.climbingtopos2.name,
    Key: {
      hk: `user#${userSub}`,
      sk: `list#route#${listSlug}#crag#${cragSlug}#area#${areaSlug}#topo#${topoSlug}#route#${routeSlug}`,
    },
  };

  await dynamodb.send(new DeleteCommand(params));
}
