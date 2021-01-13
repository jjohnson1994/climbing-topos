import { nanoid } from "nanoid";
import { DateTime } from "luxon";

import { dynamodb } from '../db';
import { AreaRequest } from "../../core/types";
import { createSlug } from "../helpers/slug";

export async function createArea(areaDescription: AreaRequest, userSub: string) {
  const date = DateTime.utc().toString();
  const slug = createSlug(`${areaDescription.title}-${nanoid(5)}`);
  
  const areaData: AreaRequest = {
    access: areaDescription.access,
    accessDetails: areaDescription.accessDetails,
    approachNotes: areaDescription.approachNotes,
    country: areaDescription.country,
    countryCode: areaDescription.countryCode,
    county: areaDescription.county,
    cragSlug: areaDescription.cragSlug,
    cragTitle: areaDescription.cragTitle,
    description: areaDescription.description,
    latitude: areaDescription.latitude,
    longitude: areaDescription.longitude,
    rockType: areaDescription.rockType,
    state: areaDescription.state,
    tags: areaDescription.tags,
    title: areaDescription.title,
  };

  const params = {
    TableName: String(process.env.DB),
    Item: {
      hk: areaDescription.cragSlug,
      sk: `area#${slug}#`,
      ...areaData,
      model: "area",
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

export async function getAreasByCragSlug(cragSlug: string): Promise<AreaRequest[]> {
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
  return crag?.Items as AreaRequest[];
}

export async function getAreaBySlug(slug: string): Promise<AreaRequest> {
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

  const area = await dynamodb.query(params).promise()
  return area?.Items?.[0] as AreaRequest;
}
