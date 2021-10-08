import { nanoid } from "nanoid";
import { DateTime } from "luxon";

import { dynamodb } from '../db';
import { Area, AreaRequest, Auth0UserPublicData } from "core/types";
import { createSlug } from "../helpers/slug";
import { ExpressionAttributeNameMap, UpdateExpression } from "aws-sdk/clients/dynamodb";

export async function createArea(
  areaDescription: AreaRequest,
  user: Auth0UserPublicData,
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
    TableName: String(process.env.tableName),
    Item: {
      hk: areaDescription.cragSlug,
      sk: `area#${slug}#`,
      ...areaData,
      logCount: 0,
      model: 'area',
      routeCount: 0,
      slug,
      verified: areaVerified,
      createdBy: user,
      createdAt: date,
      updatedAt: date
    }
  }
  
  await dynamodb.put(params).promise();

  return {
    slug,
  };
}

export async function getAreasByCragSlug(cragSlug: string): Promise<Area[]> {
  const params = {
    TableName: String(process.env.tableName),
    KeyConditionExpression: "#hk = :hk AND begins_with(#sk, :sk)",
    ExpressionAttributeNames: {
      "#hk": "hk",
      "#sk": "sk"
    },
    ExpressionAttributeValues: {
      ":hk": cragSlug,
      ":sk": "area#"
    }
  }

  const crag = await dynamodb.query(params).promise()
  return crag?.Items as Area[];
}

export async function getAreaBySlug(slug: string): Promise<Area> {
  // TODO can be refactored out and replace with `hk = hk and begins_with(sk, sk)`
  const params = {
    TableName: String(process.env.tableName),
    IndexName: "gsi2",
    KeyConditionExpression: "#model = :model AND #slug = :slug",
    ExpressionAttributeNames:{
      "#model": "model",
      "#slug": "slug"
    },
    ExpressionAttributeValues: {
      ":model": "area",
      ":slug": slug
    }
  }

  const area = await dynamodb.query(params).promise()
  return area?.Items?.[0] as Area;
}

export async function update(
  cragSlug: string,
  areaSlug: string,
  updateProps: {
    UpdateExpression: UpdateExpression;
    ExpressionAttributeNames: ExpressionAttributeNameMap;
    ExpressionAttributeValues: { [key: string]: any };
  }
) {
  const params = {
    TableName: String(process.env.tableName),
    Key: {
      "hk": cragSlug,
      "sk": `area#${areaSlug}#`,
    },
    ...updateProps,
  }

  console.log('update area', params)
  return dynamodb.update(params, (error) => {
    if (error) {
      console.error(error);
    }
  });
}
