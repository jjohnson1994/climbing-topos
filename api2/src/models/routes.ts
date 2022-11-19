import { nanoid } from "nanoid";
import { DateTime } from "luxon";

import { dynamodb } from '../db';
import { UserPublicData, Route, RouteRequest } from "core/types";
import { createSlug } from "../helpers/slug";
import { ExpressionAttributeNameMap, UpdateExpression } from "aws-sdk/clients/dynamodb";

export async function createRoute(routeDescription: RouteRequest, auth0UserPublicData: UserPublicData, verified: boolean) {
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
    TableName: String(process.env.tableName),
    Item: {
      hk: routeDescription.cragSlug,
      sk: `route#area#${routeDescription.areaSlug}#topo#${routeDescription.topoSlug}#${slug}`,
      ...routeData,
      gradeTally: {},
      gradeModal: routeDescription.grade,
      logCount: 0,
      model: "route",
      rating: 0,
      ratingTally: {},
      slug,
      verified,
      createdBy: auth0UserPublicData,
      createdAt: date,
      updatedAt: date
    }
  }

  await dynamodb.put(params).promise();

  return {
    slug,
  };
}

export async function listRoutes(
  cragSlug: string,
  areaSlug?: string,
  topoSlug?: string,
  routeSlug?: string
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
    TableName: String(process.env.tableName),
    KeyConditionExpression: "#hk = :hk AND begins_with(#sk, :sk)",
    ExpressionAttributeNames: {
      "#hk": "hk",
      "#sk": "sk"
    },
    ExpressionAttributeValues: {
      ":hk": cragSlug,
      ":sk": queryString
    }
  }

  const route = await dynamodb.query(params).promise()
  return route?.Items as Route[];
}

export async function getRouteBySlug(
  routeSlug: string
): Promise<Route> {
  const params = {
    TableName: String(process.env.tableName),
    IndexName: 'gsi2',
    KeyConditionExpression: "#model = :model AND #slug = :slug",
    ExpressionAttributeNames: {
      "#model": "model",
      "#slug": "slug"
    },
    ExpressionAttributeValues: {
      ":model": "route",
      ":slug": routeSlug
    }
  }

  const route = await dynamodb.query(params).promise()

  return route?.Items?.[0] as Route;
}

export async function update(
  cragSlug: string,
  areaSlug: string,
  topoSlug: string,
  routeSlug: string,
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
      "sk": `route#area#${areaSlug}#topo#${topoSlug}#${routeSlug}`
    },
    ...updateProps
  }

  return dynamodb.update(params, (err) => {
    if (err) {
      console.error(err);
    }
  });
}
