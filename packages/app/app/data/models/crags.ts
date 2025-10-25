'use server';

import { DateTime } from 'luxon';
import { nanoid } from 'nanoid';
import { Resource } from 'sst';

import { UserPublicData, Crag, CragRequest } from '@climbingtopos/types';
import { createSlug } from '@/app/helpers/slug';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  PutCommand,
  UpdateCommand,
  QueryCommand,
  DynamoDBDocumentClient,
} from '@aws-sdk/lib-dynamodb';

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const createCrag = async (
  cragDetails: CragRequest,
  auth0UserPublicData: UserPublicData,
) => {
  const date = DateTime.utc().toString();
  const slug = createSlug(`${cragDetails.title}-${nanoid(5)}`);

  const cragData: CragRequest = {
    access: cragDetails.access,
    accessDetails: cragDetails.accessDetails,
    accessLink: cragDetails.accessLink,
    approachNotes: cragDetails.approachNotes,
    carParks: cragDetails.carParks,
    description: cragDetails.description,
    latitude: cragDetails.latitude,
    longitude: cragDetails.longitude,
    osmData: cragDetails.osmData,
    tags: cragDetails.tags,
    title: cragDetails.title,
    image: cragDetails.image,
  };

  const params = {
    TableName: Resource.climbingtopos2.name,
    Item: {
      hk: slug,
      sk: 'metadata#',
      ...cragData,
      verified: false,
      areaCount: 0,
      city: cragDetails.osmData.address.city,
      country: cragDetails.osmData.address.country,
      countryCode: cragDetails.osmData.address.country_code,
      county: cragDetails.osmData.address.county,
      createdAt: date,
      managedBy: auth0UserPublicData,
      createdBy: auth0UserPublicData,
      logCount: 0,
      model: 'crag',
      routeCount: 0,
      slug,
      state: cragDetails.osmData.address.state,
      updatedAt: date,
    },
  };

  await dynamoDb.send(new PutCommand(params));

  return {
    slug,
  };
};

export async function getAllCrags(
  limit?: number,
  lastEvaluatedKey?: Record<string, any>,
): Promise<{ items: Crag[]; lastEvaluatedKey?: Record<string, any> }> {
  const params: any = {
    TableName: Resource.climbingtopos2.name,
    IndexName: 'gsi1',
    KeyConditionExpression: '#model = :entity',
    ProjectionExpression:
      '#slug, #title, #description, #image, #areaCount, #routeCount, #logCount, #latitude, #longitude, #tags, #city, #country, #countryCode, #county, #state, #verified, #access',
    ExpressionAttributeNames: {
      '#model': 'model',
      '#slug': 'slug',
      '#title': 'title',
      '#description': 'description',
      '#image': 'image',
      '#areaCount': 'areaCount',
      '#routeCount': 'routeCount',
      '#logCount': 'logCount',
      '#latitude': 'latitude',
      '#longitude': 'longitude',
      '#tags': 'tags',
      '#city': 'city',
      '#country': 'country',
      '#countryCode': 'countryCode',
      '#county': 'county',
      '#state': 'state',
      '#verified': 'verified',
      '#access': 'access',
    },
    ExpressionAttributeValues: {
      ':entity': 'crag',
    },
  };

  // Use DynamoDB native pagination
  if (limit) {
    params.Limit = limit;
  }

  if (lastEvaluatedKey) {
    params.ExclusiveStartKey = lastEvaluatedKey;
  }

  const response = await dynamoDb.send(new QueryCommand(params));

  return {
    items: (response.Items || []) as Crag[],
    lastEvaluatedKey: response.LastEvaluatedKey,
  };
}

export const getCragBySlug = async (slug: string): Promise<Crag> => {
  const params = {
    TableName: Resource.climbingtopos2.name,
    KeyConditionExpression: '#hk = :hk AND #sk = :sk',
    ExpressionAttributeNames: {
      '#hk': 'hk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':hk': slug,
      ':sk': 'metadata#',
    },
  };

  const crag = await dynamoDb.send(new QueryCommand(params));
  return crag?.Items?.[0] as Crag;
};

export async function update(
  cragSlug: string,
  updateProps: {
    UpdateExpression: string;
    ExpressionAttributeNames: Record<string, string>;
    ExpressionAttributeValues: Record<string, any>;
  },
) {
  try {
    const params = {
      TableName: Resource.climbingtopos2.name,
      Key: {
        hk: cragSlug,
        sk: 'metadata#',
      },
      ...updateProps,
    };

    const response = await dynamoDb.send(new UpdateCommand(params));

    return response;
  } catch (error) {
    console.error('Error updating crag', error);
    throw error;
  }
}
