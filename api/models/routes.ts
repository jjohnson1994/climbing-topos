import { nanoid } from "nanoid";
import { DateTime } from "luxon";

import { dynamodb } from '../db';
import { Route } from "../../core/types";
import { createSlug } from "../helpers/slug";

export async function createRoute(routeDescription: Route) {
  const date = DateTime.utc().toString();
  const slug = createSlug(`${routeDescription.title}-${nanoid(5)}`);
  const params = {
    TableName: String(process.env.DB),
    Item: {
      hk: routeDescription.cragSlug,
      sk: `route#${slug}#`,
      areaSlug: routeDescription.areaSlug,
      cragSlug: routeDescription.cragSlug,
      description: routeDescription.description,
      drawing: routeDescription.drawing,
      grade: routeDescription.grade,
      gradingSystem: routeDescription.gradingSystem,
      model: "route",
      routeType: routeDescription.routeType,
      ration: -1,
      slug,
      tags: routeDescription.tags,
      title: routeDescription.title,
      topoSlug: routeDescription.topoSlug,
      createdAt: date,
      updatedAt: date
    }
  }

  await dynamodb.put(params).promise();

  return {
    slug,
  };
}

export async function getRoutesByCragSlug(cragSlug: string) {
  const params = {
    TableName: String(process.env.DB),
    KeyConditionExpression: "#hk = :hk AND begins_with(#sk, :sk)",
    ExpressionAttributeNames:{
      "#hk": "hk",
      "#sk": "sk"
    },
    ExpressionAttributeValues: {
      ":hk": cragSlug,
      ":sk": `route#`
    }
  }

  const crag = await dynamodb.query(params).promise()
  return crag?.Items || [];

}
