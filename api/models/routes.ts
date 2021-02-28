import { nanoid } from "nanoid";
import { DateTime } from "luxon";

import { dynamodb } from '../db';
import { Route, RouteRequest } from "../../core/types";
import { createSlug } from "../helpers/slug";
import { ExpressionAttributeNameMap, UpdateExpression } from "aws-sdk/clients/dynamodb";

export async function createRoute(routeDescription: RouteRequest, userId: string) {
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
    rating: routeDescription.rating,
    rockType: routeDescription.rockType,
    routeType: routeDescription.routeType,
    state: routeDescription.state,
    tags: routeDescription.tags,
    title: routeDescription.title,
    topoSlug: routeDescription.topoSlug,
  };

  const params = {
    TableName: String(process.env.DB),
    Item: {
      hk: routeDescription.cragSlug,
      sk: `route#area#${routeDescription.areaSlug}#topo#${routeDescription.topoSlug}#${slug}`,
      ...routeData,
      logCount: 0,
      model: "route",
      slug,
      createdBy: userId,
      createdAt: date,
      updatedAt: date
    }
  }

  await dynamodb.put(params).promise();

  return {
    slug,
  };
}

export async function getRouteBySlug(
  cragSlug: string,
  areaSlug: string,
  topoSlug: string,
  routeSlug: string
): Promise<Route> {
  const params = {
    TableName: String(process.env.DB),
    KeyConditionExpression: "#hk = :hk AND #sk = :sk",
    ExpressionAttributeNames: {
      "#hk": "hk",
      "#sk": "sk"
    },
    ExpressionAttributeValues: {
      ":hk": cragSlug,
      ":sk": `route#area#${areaSlug}#topo#${topoSlug}#${routeSlug}`
    }
  }

  const route = await dynamodb.query(params).promise()
  return route?.Items?.[0] as Route;
}

export async function getRoutesByCragSlug(
  cragSlug: string
): Promise<Route[]> {
  const params = {
    TableName: String(process.env.DB),
    KeyConditionExpression: "#hk = :hk AND begins_with(#sk, :sk)",
    ExpressionAttributeNames: {
      "#hk": "hk",
      "#sk": "sk"
    },
    ExpressionAttributeValues: {
      ":hk": cragSlug,
      ":sk": `route#`
    }
  }

  const response = await dynamodb.query(params).promise()
  return response?.Items as Route[];
}

export async function getRoutesByTopoSlug(
  cragSlug: string,
  areaSlug: string,
  topoSlug: string
): Promise<Route[]> {
  const params = {
    TableName: String(process.env.DB),
    KeyConditionExpression: "#hk = :hk AND begins_with(#sk, :sk)",
    ExpressionAttributeNames: {
      "#hk": "hk",
      "#sk": "sk"
    },
    ExpressionAttributeValues: {
      ":hk": cragSlug,
      ":sk": `route#area#${areaSlug}#topo#${topoSlug}`
    }
  }

  const response = await dynamodb.query(params).promise()
  return response?.Items as Route[];
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
    TableName: String(process.env.DB),
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
