import { nanoid } from "nanoid";
import { DateTime } from "luxon";

import { dynamodb } from '../db';
import { Topo } from "../../core/types";

export async function createTopo(topoDetails: Topo) {
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

export async function getToposByAreaSlug(cragSlug: string, areaSlug: string) {
  console.log(cragSlug, areaSlug);
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
  return response?.Items;
}
