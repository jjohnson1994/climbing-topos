import { nanoid } from "nanoid";
import { DateTime } from "luxon";
import { Resource } from "sst";

import { Area, AreaRequest, UserPublicData } from "@climbingtopos/types";
import { createSlug } from "@/helpers/slug";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, UpdateCommand, QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export async function createArea(
  areaDescription: AreaRequest,
  auth0UserPublicData: UserPublicData,
  areaVerified: boolean
) {
  const date = DateTime.utc().toString();
  const slug = createSlug(`${areaDescription.title}-${nanoid(5)}`);

  const areaData: AreaRequest = {
    access: areaDescription.access,
    accessDetails: areaDescription.accessDetails,
    approachNotes: areaDescription.approachNotes,
    country: areaDescription.country,
    countryCode: areaDescription.countryCode,
    county: areaDescription.county,
    cragSlug: areaDescription.cragSlug,
    cragTitle: areaDescription.cragTitle,
    description: areaDescription.description,
    latitude: areaDescription.latitude,
    longitude: areaDescription.longitude,
    rockType: areaDescription.rockType,
    state: areaDescription.state,
    tags: areaDescription.tags,
    title: areaDescription.title,
  };

  const params = {
    TableName: Resource.climbingtopos2.name,
    Item: {
      hk: areaDescription.cragSlug,
      sk: `area#${slug}#`,
      ...areaData,
      logCount: 0,
      model: "area",
      routeCount: 0,
      slug,
      verified: areaVerified,
      createdBy: auth0UserPublicData,
      createdAt: date,
      updatedAt: date,
    },
  };

  await dynamoDb.send(new PutCommand(params))

  return {
    slug,
  };
}

export async function getAreasByCragSlug(cragSlug: string): Promise<Area[]> {
  const params = {
    TableName: Resource.climbingtopos2.name,
    KeyConditionExpression: "#hk = :hk AND begins_with(#sk, :sk)",
    ExpressionAttributeNames: {
      "#hk": "hk",
      "#sk": "sk",
    },
    ExpressionAttributeValues: {
      ":hk": cragSlug,
      ":sk": "area#",
    },
  };

  const crag = await dynamoDb.send(new QueryCommand(params))

  return crag?.Items as Area[];
}

export async function getAreaBySlug(slug: string): Promise<Area> {
  const params = {
    TableName: Resource.climbingtopos2.name,
    IndexName: "gsi2",
    KeyConditionExpression: "#model = :model AND #slug = :slug",
    ExpressionAttributeNames: {
      "#model": "model",
      "#slug": "slug",
    },
    ExpressionAttributeValues: {
      ":model": "area",
      ":slug": slug,
    },
  };

  const area = await dynamoDb.send(new QueryCommand(params))

  return area?.Items?.[0] as Area;
}

export async function update(
  cragSlug: string,
  areaSlug: string,
  updateProps: {
    UpdateExpression: string;
    ExpressionAttributeNames: Record<string, string>;
    ExpressionAttributeValues: Record<string, any>;
  }
) {
  const params = {
    TableName: Resource.climbingtopos2.name,
    Key: {
      hk: cragSlug,
      sk: `area#${areaSlug}#`,
    },
    ...updateProps,
  };

  return dynamoDb.send(new UpdateCommand(params), (error) => {
    if (error) {
      console.error(error);
    }
  });
}
