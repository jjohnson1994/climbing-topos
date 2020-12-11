import { nanoid } from "nanoid";
import { DateTime } from "luxon";

import { dynamodb } from '../db';
import { Crag } from '../../core/types';
import { createSlug } from "../helpers/slug";

export const createCrag = async (cragDetails: Crag) => {
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
  const params = {
    TableName: String(process.env.DB),
    Item: {
      hk: slug,
      sk: `crag#${country_code}#${state}#${county}#${city}#`.toUpperCase(),
      access: cragDetails.access,
      accessDetails: cragDetails.accessDetails,
      accessLink: cragDetails.accessLink,
      approachNotes: cragDetails.approachNotes,
      carParks: cragDetails.carParks,
      city,
      country,
      countryCode: country_code,
      county,
      description: cragDetails.description,
      latitude: cragDetails.latitude,
      longitude: cragDetails.longitude,
      model: 'crag',
      osmPlaceId: place_id,
      slug,
      state,
      tags: cragDetails.tags,
      title: cragDetails.title,
      createdAt: date,
      updatedAt: date
    }
  }

  await dynamodb.put(params).promise()
  return {
    slug,
  };
}

export const getAllCrags = async () => {
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
  return crags;
}

export const getCragBySlug = async (slug: string) => {
  const params = {
    TableName: String(process.env.DB),
    IndexName: "gsi2",
    KeyConditionExpression: "#model = :entity AND #slug = :slug",
    ExpressionAttributeNames:{
      "#model": "model",
      "#slug": "slug"
    },
    ExpressionAttributeValues: {
      ":entity": "crag",
      ":slug": slug
    }
  }

  const crag = await dynamodb.query(params).promise()
  return crag?.Items?.[0];
}

export const getAllCragsByCountry = async (countryCode: string) => {
  const params = {
    TableName: String(process.env.DB),
    KeyConditionExpression: 'begins_with(PK, :entity) AND begins_with(SK, :countryCode)',
    ExpressionAttributeValues: { ':entity': 'CRAG', ':countryCode': countryCode }
  }

  const crags = await dynamodb.query(params).promise()
  return crags;
}

export const getAllCragsByCountryAndRegion = async (countryCode: string, region: string) => {
  const params = {
    TableName: String(process.env.DB),
    KeyConditionExpression: 'begins_with(PK, :entity) AND begins_with(SK, :countryCodeAndRegion)',
    ExpressionAttributeValues: { ':entity': 'CRAG', ':countryCodeRegion': `${countryCode}#${region}` }
  }

  const crags = await dynamodb.query(params).promise()
  return crags;
}
