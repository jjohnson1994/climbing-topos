import { nanoid } from "nanoid";
import { DateTime } from "luxon";

import { dynamodb } from '../db';
import { Area } from "../../core/types";
import { createSlug } from "../helpers/slug";

export async function createArea(areaDescription: Area) {
  const date = DateTime.utc().toString();
  const slug = createSlug(`${areaDescription.title}-${nanoid(5)}`);
  const params = {
    TableName: String(process.env.DB),
    Item: {
      hk: areaDescription.cragSlug,
      sk: `area#${slug}#`,
      access: areaDescription.access,
      accessDetails: areaDescription.accessDetails,
      approachNotes: areaDescription.approachNotes,
      description: areaDescription.description,
      latitude: areaDescription.latitude,
      longitude: areaDescription.longitude,
      model: "area",
      slug,
      tags: areaDescription.tags,
      title: areaDescription.title,
      createdAt: date,
      updatedAt: date
    }
  }

  await dynamodb.put(params).promise();

  return {
    slug,
  };
}

export const getAreasByCragSlug = async (cragSlug: string) => {
  const params = {
    TableName: String(process.env.DB),
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
  return crag?.Items;
}

export const getAreaBySlug = async (slug: string) => {
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
      ":model": "area",
      ":slug": slug
    }
  }

  const crag = await dynamodb.query(params).promise()
  return crag?.Items?.[0];
}
