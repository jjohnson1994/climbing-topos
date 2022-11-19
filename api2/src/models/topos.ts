import { nanoid } from "nanoid";
import { DateTime } from "luxon";
import { ExpressionAttributeNameMap, UpdateExpression } from "aws-sdk/clients/dynamodb";

import { dynamodb } from "../db";
import { UserPublicData, Topo, TopoRequest } from "core/types";

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
    TableName: String(process.env.tableName),
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

  await dynamodb.put(params).promise();
}

export async function getToposByCragSlug(
  cragSlug: string
): Promise<Topo[]> {
  const params = {
    TableName: String(process.env.tableName),
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

  const response = await dynamodb.query(params).promise()
  return response?.Items as Topo[];
}

export async function getToposByCragArea(cragSlug: string, areaSlug: string): Promise<Topo[]> {
  const params = {
    TableName: String(process.env.tableName),
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

  const response = await dynamodb.query(params).promise()
  return response?.Items as Topo[];
}

export async function getTopo(cragSlug: string, areaSlug: string, topoSlug: string): Promise<Topo> {
  const params = {
    TableName: String(process.env.tableName),
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

  const topo = await dynamodb.query(params).promise()
  return topo?.Items?.[0] as Topo;
}

export async function getTopoBySlug(slug: string): Promise<Topo> {
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
      ":model": "topo",
      ":slug": slug
    }
  }

  const crag = await dynamodb.query(params).promise()
  return crag?.Items?.[0] as Topo;
}

export async function update(
  cragSlug: string,
  areaSlug: string,
  topoSlug: string,
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
      "sk": `topo#${areaSlug}#${topoSlug}`
    },
    ...updateProps
  }

  return dynamodb.update(params, (error) => {
    if (error) {
      console.error(error);
    }
  });
}
