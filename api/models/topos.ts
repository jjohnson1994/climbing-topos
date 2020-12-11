import { nanoid } from "nanoid";
import { DateTime } from "luxon";

import { dynamodb } from "../db";
import { Topo } from "../../core/types";

export async function createTopo(topoDetails: Topo) {
  console.log("topo details", topoDetails);
  const date = DateTime.utc().toString();
  const slug = nanoid();
  const params = {
    TableName: String(process.env.DB),
    Item: {
      hk: topoDetails.cragSlug,
      sk: `topo#${topoDetails.areaSlug}#${slug}`,
      model: "topo",
      description: topoDetails.description,
      image: topoDetails.image,
      slug,
      orientation: topoDetails.orientation,
      createdAt: date,
      updatedAt: date
    }
  }

  await dynamodb.put(params).promise();
}

export async function getToposByCragArea(cragSlug: string, areaSlug: string) {
  const params = {
    TableName: String(process.env.DB),
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
  return response?.Items || [];
}

export const getTopoBySlug = async (slug: string) => {
  // TODO can be refactored out and replace with `hk = hk and begins_with(sk, sk)`
  const params = {
    TableName: String(process.env.DB),
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
  return crag?.Items?.[0];
}
