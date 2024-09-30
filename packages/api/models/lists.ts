import { nanoid } from "nanoid";
import { DateTime } from "luxon";
import { Resource } from "sst";

import { UserPublicData, List, ListRequest, ListRoute, ListRoutePartial } from "@climbingtopos/types";
import { createSlug } from "@/helpers/slug";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, UpdateCommand, QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamodb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export async function createList(user: UserPublicData, listRequest: ListRequest) {
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
      model: "list",
      slug,
      createdBy: user,
      createdAt: date,
      updatedAt: date
    }
  }

  await dynamodb.send(new PutCommand(params))

  return {
    slug,
  };
}

export async function getListBySlug(userSub: string, listSlug: string): Promise<List> {
  const params = {
    TableName: Resource.climbingtopos2.name,
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

  const list = await dynamodb.send(new QueryCommand(params))

  return list?.Items?.[0] as List;
}

export async function getListRoutes(listSlug: string): Promise<ListRoute[]> {
  const params = {
    TableName: Resource.climbingtopos2.name,
    IndexName: "gsi1",
    KeyConditionExpression: "#model = :model AND begins_with(#sk, :sk)",
    FilterExpression: "#listSlug = :listSlug",
    ExpressionAttributeNames: {
      "#model": "model",
      "#sk": "sk",
      "#listSlug": "listSlug",
    },
    ExpressionAttributeValues: {
      ":model": "listRoute",
      ":sk": `list#route#`,
      ":listSlug": listSlug,
    }
  };

  const listRoutes = await dynamodb.send(new QueryCommand(params))

  return listRoutes.Items as ListRoute[];
}

export async function getUserLists(userSub: string): Promise<List[]> {
  const params = {
    TableName: Resource.climbingtopos2.name,
    KeyConditionExpression: "#hk = :hk AND begins_with(#sk, :sk)",
    ExpressionAttributeNames:{
      "#hk": "hk",
      "#sk": "sk"
    },
    ExpressionAttributeValues: {
      ":hk": `user#${userSub}`,
      ":sk": `list#metadata#`,
    }
  }

  const lists = await dynamodb.send(new QueryCommand(params))

  return lists?.Items as List[];
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
    TableName: Resource.climbingtopos2.name,
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

  await dynamodb.send(new PutCommand(params))

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
  }
) {
  const params = {
    TableName: Resource.climbingtopos2.name,
    Key: {
      "hk": `user#${userSub}`,
      "sk": `list#metadata#${listSlug}`,
    },
    ...updateProps
  }

  return dynamodb.send(new UpdateCommand(params), (err) => {
    if (err) {
      console.error(err);
    }
  });
}
