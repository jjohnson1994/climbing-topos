import { nanoid } from 'nanoid';
import { DateTime } from 'luxon';
import { Resource } from 'sst';

import { UserPublicData, Route, RouteRequest } from '@climbingtopos/types';
import { createSlug } from '@/app/helpers/slug';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  PutCommand,
  UpdateCommand,
  QueryCommand,
  DynamoDBDocumentClient,
} from '@aws-sdk/lib-dynamodb';

const dynamodb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export async function createRoute(
  routeDescription: RouteRequest,
  auth0UserPublicData: UserPublicData,
  verified: boolean,
) {
  const date = DateTime.utc().toString();
  const slug = createSlug(`${routeDescription.title}-${nanoid(5)}`);

  const routeData: RouteRequest = {
    areaSlug: routeDescription.areaSlug,
    areaTitle: routeDescription.areaTitle,
    country: routeDescription.country,
    countryCode: routeDescription.country,
    county: routeDescription.county,
    cragSlug: routeDescription.cragSlug,
    cragTitle: routeDescription.cragTitle,
    description: routeDescription.description,
    drawing: routeDescription.drawing,
    grade: routeDescription.grade,
    gradingSystem: routeDescription.gradingSystem,
    latitude: routeDescription.latitude,
    longitude: routeDescription.longitude,
    rockType: routeDescription.rockType,
    routeType: routeDescription.routeType,
    state: routeDescription.state,
    tags: routeDescription.tags,
    title: routeDescription.title,
    topoSlug: routeDescription.topoSlug,
  };

  const params = {
    TableName: Resource.climbingtopos2.name,
    Item: {
      hk: routeDescription.cragSlug,
      sk: `route#area#${routeDescription.areaSlug}#topo#${routeDescription.topoSlug}#${slug}`,
      ...routeData,
      gradeTally: {},
      gradeModal: routeDescription.grade,
      logCount: 0,
      model: 'route',
      rating: 0,
      ratingTally: {},
      slug,
      verified,
      createdBy: auth0UserPublicData,
      createdAt: date,
      updatedAt: date,
    },
  };

  await dynamodb.send(new PutCommand(params));

  return {
    slug,
  };
}

export async function listRoutes(
  cragSlug: string,
  areaSlug?: string,
  topoSlug?: string,
  routeSlug?: string,
): Promise<Route[]> {
  let queryString = `route#`;

  if (areaSlug) {
    queryString += `area#${areaSlug}#`;
  }

  if (areaSlug && topoSlug) {
    queryString += `topo#${topoSlug}#`;
  }

  if (areaSlug && topoSlug && routeSlug) {
    queryString += routeSlug;
  }

  const params = {
    TableName: Resource.climbingtopos2.name,
    KeyConditionExpression: '#hk = :hk AND begins_with(#sk, :sk)',
    ProjectionExpression:
      '#slug, #title, #description, #grade, #gradeModal, #gradingSystem, #routeType, #rating, #tags, #drawing, #verified, #logCount, #areaSlug, #areaTitle, #cragSlug, #cragTitle, #topoSlug, #rockType, #latitude, #longitude, #ratingTally, #gradeTally, #recentLogs, #createdBy',
    ExpressionAttributeNames: {
      '#hk': 'hk',
      '#sk': 'sk',
      '#slug': 'slug',
      '#title': 'title',
      '#description': 'description',
      '#grade': 'grade',
      '#gradeModal': 'gradeModal',
      '#gradingSystem': 'gradingSystem',
      '#routeType': 'routeType',
      '#rating': 'rating',
      '#tags': 'tags',
      '#drawing': 'drawing',
      '#verified': 'verified',
      '#logCount': 'logCount',
      '#areaSlug': 'areaSlug',
      '#areaTitle': 'areaTitle',
      '#cragSlug': 'cragSlug',
      '#cragTitle': 'cragTitle',
      '#topoSlug': 'topoSlug',
      '#rockType': 'rockType',
      '#latitude': 'latitude',
      '#longitude': 'longitude',
      '#ratingTally': 'ratingTally',
      '#gradeTally': 'gradeTally',
      '#recentLogs': 'recentLogs',
      '#createdBy': 'createdBy',
    },
    ExpressionAttributeValues: {
      ':hk': cragSlug,
      ':sk': queryString,
    },
  };

  const route = await dynamodb.send(new QueryCommand(params));

  return route?.Items as Route[];
}

export async function getRouteBySlug(routeSlug: string): Promise<Route> {
  const params = {
    TableName: Resource.climbingtopos2.name,
    IndexName: 'gsi2',
    KeyConditionExpression: '#model = :model AND #slug = :slug',
    ExpressionAttributeNames: {
      '#model': 'model',
      '#slug': 'slug',
    },
    ExpressionAttributeValues: {
      ':model': 'route',
      ':slug': routeSlug,
    },
  };

  const route = await dynamodb.send(new QueryCommand(params));

  return route?.Items?.[0] as Route;
}

export async function update(
  cragSlug: string,
  areaSlug: string,
  topoSlug: string,
  routeSlug: string,
  updateProps: {
    UpdateExpression: string;
    ExpressionAttributeNames: Record<string, string>;
    ExpressionAttributeValues: Record<string, any>;
  },
) {
  const params = {
    TableName: Resource.climbingtopos2.name,
    Key: {
      hk: cragSlug,
      sk: `route#area#${areaSlug}#topo#${topoSlug}#${routeSlug}`,
    },
    ...updateProps,
  };

  return dynamodb.send(new UpdateCommand(params), (err) => {
    if (err) {
      console.error(err);
    }
  });
}
