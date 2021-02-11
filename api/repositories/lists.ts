import { nanoid } from "nanoid";
import { DateTime } from "luxon";

import { dynamodb, rdsDataService } from '../db';
import { List, ListRequest, ListRoute, ListRoutePartial } from "../../core/types";
import { createSlug } from "../helpers/slug";
import { ExpressionAttributeNameMap, UpdateExpression } from "aws-sdk/clients/dynamodb";

export async function createList(userSub: string, listRequest: ListRequest) {
  const date = DateTime.utc().toString();
  const slug = createSlug(`${listRequest.title}-${nanoid(5)}`);
  
  const listData: ListRequest = {
    title: listRequest.title,
  };

  const params = {
    TableName: String(process.env.DB),
    Item: {
      hk: `user#${userSub}`,
      sk: `list#metadata#${slug}`,
      ...listData,
      routeCount: 0,
      model: "list",
      slug,
      createdBy: userSub,
      createdAt: date,
      updatedAt: date
    }
  }

  await dynamodb.put(params).promise();

  return {
    slug,
  };
}

export async function getListBySlug(userSub: string, listSlug: string): Promise<List> {
  const params = {
    TableName: String(process.env.DB),
    KeyConditionExpression: "#hk = :hk AND begins_with(#sk, :sk)",
    ExpressionAttributeNames: {
      "#hk": "hk",
      "#sk": "sk"
    },
    ExpressionAttributeValues: {
      ":hk": `user#${userSub}`,
      ":sk": `list#metadata#${listSlug}`
    }
  }

  const list = await dynamodb.query(params).promise()
  return list?.Items?.[0] as List;
}

export async function getListRoutes(listId: string): Promise<ListRoute[]> {
  const { records } = await rdsDataService.executeStatement({
    database: process.env.DATABASE_NAME,
    resourceArn: `${process.env.DATABASE_RESOURCE_ARN}`,
    secretArn: `${process.env.DATABASE_SECRET_ARN}`,
    sql: `
      SELECT
        list_routes.*
      FROM
        lists
      LEFT JOIN list_routes
        ON list_routes.list_id = lists.id
      WHERE lists.id = :id
    `,
    parameters: [
      {
        name: "id",
        value: {
          "stringValue": listId
        }
      }
    ]
  }).promise();

  return records;
}

export async function getUserLists(userSub: string): Promise<List[]> {
  const { records } = await rdsDataService.executeStatement({
    database: process.env.DATABASE_NAME,
    resourceArn: `${process.env.DATABASE_RESOURCE_ARN}`,
    secretArn: `${process.env.DATABASE_SECRET_ARN}`,
    sql: "SELECT * FROM lists", 
  }).promise();

  return records;
}

export async function addRouteToList(
  userSub: string, 
  listSlug: string, 
  route: ListRoutePartial
) {
  const date = DateTime.utc().toString();
  const slug = nanoid();
  
  const listRoute: ListRoute = {
    ...route,
    listSlug,
    slug,
  };

  const params = {
    TableName: String(process.env.DB),
    Item: {
      hk: `user#${userSub}`,
      sk: `list#route#crag#${listRoute.cragSlug}#area#${listRoute.areaSlug}#topo#${listRoute.topoSlug}#route#${listRoute.routeSlug}`,
      ...listRoute,
      createdBy: userSub,
      model: "listRoute",
      slug,
      createdAt: date,
      updatedAt: date
    }
  }

  await dynamodb.put(params).promise();

  return {
    slug,
  };
}
export async function update(
  listSlug: string,
  userSub: string,
  updateProps: {
    UpdateExpression: UpdateExpression;
    ExpressionAttributeNames: ExpressionAttributeNameMap;
    ExpressionAttributeValues: { [key: string]: any };
  }
) {
  const params = {
    TableName: String(process.env.DB),
    Key: {
      "hk": `user#${userSub}`,
      "sk": `list#metadata#${listSlug}`,
    },
    ...updateProps
  }

  return dynamodb.update(params, (err) => {
    if (err) {
      console.error(err);
    }
  });
}
