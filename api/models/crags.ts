import { nanoid } from "nanoid";
import { DateTime } from "luxon";

import { dynamodb } from '../db';
import { Crag } from '../types';

const createCrag = async (cragDetails: Crag) => {
  const pk = nanoid();
  const date = DateTime.utc().toString();
  const params = {
    TableName: String(process.env.DB),
    Item: {
      hk: `crag#${pk}`,
      sk: `UK#YORKSHIRE`,
      model: 'crag',
      title: cragDetails.title,
      createdAt: date,
      updatedAt: date
    }
  }

  await dynamodb.put(params).promise()
  return {
    hk: pk,
  }
}

const getAllCrags = async () => {
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

const getAllCragsByCountry = async (countryCode: string) => {
  const params = {
    TableName: String(process.env.DB),
    KeyConditionExpression: 'begins_with(PK, :entity) AND begins_with(SK, :countryCode)',
    ExpressionAttributeValues: { ':entity': 'CRAG', ':countryCode': countryCode }
  }

  const crags = await dynamodb.query(params).promise()
  return crags;
}

const getAllCragsByCountryAndRegion = async (countryCode: string, region: string) => {
  const params = {
    TableName: String(process.env.DB),
    KeyConditionExpression: 'begins_with(PK, :entity) AND begins_with(SK, :countryCodeAndRegion)',
    ExpressionAttributeValues: { ':entity': 'CRAG', ':countryCodeRegion': `${countryCode}#${region}` }
  }

  const crags = await dynamodb.query(params).promise()
  return crags;
}

export default {
  createCrag,
  getAllCrags,
  getAllCragsByCountry,
  getAllCragsByCountryAndRegion,
}
