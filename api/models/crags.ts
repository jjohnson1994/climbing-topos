import { nanoid } from "nanoid";
import { DateTime } from "luxon";

import { dynamodb } from '../db';
import { Crag, CragRequest } from '../../core/types';
import { createSlug } from "../helpers/slug";

export const createCrag = async (cragDetails: CragRequest, ownerUserSub: string) => {
  const {
    place_id,
    address: {
      city,
      country,
      country_code,
      county,
      state,
    }
  } = cragDetails.osmData;
  const date = DateTime.utc().toString();
  const slug = createSlug(`${cragDetails.title}-${nanoid(5)}`);

  const cragData: CragRequest = {
    access: cragDetails.access,
    accessDetails: cragDetails.accessDetails,
    accessLink: cragDetails.accessLink,
    approachNotes: cragDetails.approachNotes,
    carParks: cragDetails.carParks,
    description: cragDetails.description,
    latitude: cragDetails.latitude,
    longitude: cragDetails.longitude,
    osmData: cragDetails.osmData,
    tags: cragDetails.tags,
    title: cragDetails.title,
  };

  const params = {
    TableName: String(process.env.DB),
    Item: {
      hk: slug,
      sk: `crag#${country_code}#${state}#${county}#${city}#`.toUpperCase(),
      ...cragData,
      city: cragDetails.osmData.address.city,
      country: cragDetails.osmData.address.country,
      countryCode: cragDetails.osmData.address.country_code,
      county: cragDetails.osmData.address.county,
      state: cragDetails.osmData.address.state,
      slug,
      model: 'crag',
      owner: ownerUserSub,
      createdBy: ownerUserSub,
      createdAt: date,
      updatedAt: date
    }
  }

  await dynamodb.put(params).promise()
  return {
    slug,
  };
}

export async function getAllCrags(): Promise<Crag[]> {
  const params = {
    TableName: String(process.env.DB),
    IndexName: 'gsi1',
    KeyConditionExpression: "#model = :entity",
    ExpressionAttributeNames:{
      "#model": "model"
    },
    ExpressionAttributeValues: {
      ":entity": "crag"
    }
  }

  const crags = await dynamodb.query(params).promise()
  return crags?.Items as Crag[];
}

export const getCragBySlug = async (slug: string): Promise<Crag> => {
  const params = {
    TableName: String(process.env.DB),
    KeyConditionExpression: "#hk = :hk",
    ExpressionAttributeNames:{
      "#hk": "hk",
    },
    ExpressionAttributeValues: {
      ":hk": slug,
    }
  }

  const crag = await dynamodb.query(params).promise()
  return crag?.Items?.[0] as Crag;
}

export const getAllCragsByCountry = async (countryCode: string) => {
  const params = {
    TableName: String(process.env.DB),
    KeyConditionExpression: 'begins_with(PK, :entity) AND begins_with(SK, :countryCode)',
    ExpressionAttributeValues: { ':entity': 'crag', ':countryCode': countryCode }
  }

  const crags = await dynamodb.query(params).promise()
  return crags;
}

export const getAllCragsByCountryAndRegion = async (countryCode: string, region: string) => {
  const params = {
    TableName: String(process.env.DB),
    KeyConditionExpression: 'begins_with(PK, :entity) AND begins_with(SK, :countryCodeAndRegion)',
    ExpressionAttributeValues: { ':entity': 'crag', ':countryCodeRegion': `${countryCode}#${region}` }
  }

  const crags = await dynamodb.query(params).promise()
  return crags;
}
