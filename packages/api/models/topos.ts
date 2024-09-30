import { nanoid } from "nanoid";
import { DateTime } from "luxon";
import { Resource } from "sst";

import { UserPublicData, Topo, TopoRequest } from "@climbingtopos/types";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, UpdateCommand, QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamodb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export async function createTopo(
  topoDetails: TopoRequest,
  auth0UserPublicData: UserPublicData,
  topoVerified: boolean
) {
  const date = DateTime.utc().toString();
  const slug = nanoid();

  const topoData: TopoRequest = {
    areaSlug: topoDetails.areaSlug,
    cragSlug: topoDetails.cragSlug,
    orientation: topoDetails.orientation,
    image: topoDetails.image,
    imageFileName: topoDetails.imageFileName,
  }

  const params = {
    TableName: Resource.climbingtopos2.name,
    Item: {
      hk: topoDetails.cragSlug,
      sk: `topo#${topoDetails.areaSlug}#${slug}`,
      ...topoData,
      model: "topo",
      slug,
      verified: topoVerified,
      createdBy: auth0UserPublicData,
      createdAt: date,
      updatedAt: date
    }
  }

  await dynamodb.send(new PutCommand(params))
}

export async function getToposByCragSlug(
  cragSlug: string
): Promise<Topo[]> {
  const params = {
    TableName: Resource.climbingtopos2.name,
    KeyConditionExpression: "#hk = :hk AND begins_with(#sk, :sk)",
    ExpressionAttributeNames: {
      "#hk": "hk",
      "#sk": "sk"
    },
    ExpressionAttributeValues: {
      ":hk": cragSlug,
      ":sk": `topo#`
    }
  }

  const response = await dynamodb.send(new QueryCommand(params))

  return response?.Items as Topo[];
}

export async function getToposByCragArea(cragSlug: string, areaSlug: string): Promise<Topo[]> {
  const params = {
    TableName: Resource.climbingtopos2.name,
    KeyConditionExpression: "#hk = :hk AND begins_with(#sk, :sk)",
    ExpressionAttributeNames:{
      "#sk": "sk",
      "#hk": "hk"
    },
    ExpressionAttributeValues: {
      ":hk": cragSlug,
      ":sk": `topo#${areaSlug}`
    }
  }

  const response = await dynamodb.send(new QueryCommand(params))

  return response?.Items as Topo[];
}

export async function getTopo(cragSlug: string, areaSlug: string, topoSlug: string): Promise<Topo> {
  const params = {
    TableName: Resource.climbingtopos2.name,
    KeyConditionExpression: "#hk = :hk AND begins_with(#sk, :sk)",
    ExpressionAttributeNames:{
      "#hk": "hk",
      "#sk": "sk"
    },
    ExpressionAttributeValues: {
      ":hk": cragSlug,
      ":sk": `topo#${areaSlug}#${topoSlug}`
    }
  }

  const topo = await dynamodb.send(new QueryCommand(params))

  return topo?.Items?.[0] as Topo;
}

export async function getTopoBySlug(slug: string): Promise<Topo> {
  // TODO can be refactored out and replace with `hk = hk and begins_with(sk, sk)`
  const params = {
    TableName: Resource.climbingtopos2.name,
    IndexName: "gsi2",
    KeyConditionExpression: "#model = :model AND #slug = :slug",
    ExpressionAttributeNames:{
      "#model": "model",
      "#slug": "slug"
    },
    ExpressionAttributeValues: {
      ":model": "topo",
      ":slug": slug
    }
  }

  const crag = await dynamodb.send(new QueryCommand(params))

  return crag?.Items?.[0] as Topo;
}

export async function update(
  cragSlug: string,
  areaSlug: string,
  topoSlug: string,
  updateProps: {
    UpdateExpression: string,
    ExpressionAttributeNames: Record<string, string>;
    ExpressionAttributeValues: Record<string, any>;
  }
) {
  const params = {
    TableName: Resource.climbingtopos2.name,
    Key: {
      "hk": cragSlug,
      "sk": `topo#${areaSlug}#${topoSlug}`
    },
    ...updateProps
  }

  return dynamodb.send(new UpdateCommand(params), (error) => {
    if (error) {
      console.error(error);
    }
  });
}
