import { DateTime } from "luxon";
import { nanoid } from "nanoid";
import { Resource } from "sst";

import { UserPublicData, Crag, CragRequest } from "@climbingtopos/types";
import { createSlug } from "@/helpers/slug";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, UpdateCommand, QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const createCrag = async (
  cragDetails: CragRequest,
  auth0UserPublicData: UserPublicData
) => {
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
    image: cragDetails.image,
  };

  const params = {
    TableName: Resource.climbingtopos2.name,
    Item: {
      hk: slug,
      sk: "metadata#",
      ...cragData,
      verified: false,
      areaCount: 0,
      city: cragDetails.osmData.address.city,
      country: cragDetails.osmData.address.country,
      countryCode: cragDetails.osmData.address.country_code,
      county: cragDetails.osmData.address.county,
      createdAt: date,
      managedBy: auth0UserPublicData,
      createdBy: auth0UserPublicData,
      logCount: 0,
      model: "crag",
      routeCount: 0,
      slug,
      state: cragDetails.osmData.address.state,
      updatedAt: date,
    },
  };

  await dynamoDb.send(new PutCommand(params))

  return {
    slug,
  };
};

export async function getAllCrags(
  sortBy?: string,
  sortOrder?: string,
  limit?: number,
  offset?: number
): Promise<Crag[]> {
  const params = {
    TableName: Resource.climbingtopos2.name,
    IndexName: "gsi1",
    KeyConditionExpression: "#model = :entity",
    ExpressionAttributeNames: {
      "#model": "model",
    },
    ExpressionAttributeValues: {
      ":entity": "crag",
    },
  };

  const crags = await dynamoDb
    .send(new QueryCommand(params))
    .then(({ Items }) => {
      if (sortBy) {
        return Items!.sort((cragA, cragB) => {
          if (sortOrder === "DESC") {
            return cragB[sortBy] - cragA[sortBy];
          } else if (sortOrder === "ASC") {
            return cragA[sortBy] - cragB[sortBy];
          } else {
            return 0;
          }
        });
      } else {
        return Items;
      }
    })
    .then((crags) => {
      if (typeof offset !== "undefined" && typeof limit !== "undefined") {
        return crags!.slice(offset, offset + limit);
      }

      if (typeof offset !== "undefined") {
        return crags!.slice(offset);
      }

      if (typeof limit !== "undefined") {
        return crags!.slice(0, limit);
      }

      return crags;
    });

  return crags as Crag[];
}

export const getCragBySlug = async (slug: string): Promise<Crag> => {
  const params = {
    TableName: Resource.climbingtopos2.name,
    KeyConditionExpression: "#hk = :hk AND #sk = :sk",
    ExpressionAttributeNames: {
      "#hk": "hk",
      "#sk": "sk",
    },
    ExpressionAttributeValues: {
      ":hk": slug,
      ":sk": "metadata#",
    },
  };

  const crag = await dynamoDb.send(new QueryCommand(params))
  console.log(crag?.Items?.[0])
  return crag?.Items?.[0] as Crag;
};

export const getAllCragsByCountry = async (countryCode: string) => {
  const params = {
    TableName: Resource.climbingtopos2.name,
    KeyConditionExpression:
      "begins_with(PK, :entity) AND begins_with(SK, :countryCode)",
    ExpressionAttributeValues: {
      ":entity": "crag",
      ":countryCode": countryCode,
    },
  };

  const crags = await dynamoDb.send(new QueryCommand(params))

  return crags;
};

export const getAllCragsByCountryAndRegion = async (
  countryCode: string,
  region: string
) => {
  const params = {
    TableName: Resource.climbingtopos2.name,
    KeyConditionExpression:
      "begins_with(PK, :entity) AND begins_with(SK, :countryCodeAndRegion)",
    ExpressionAttributeValues: {
      ":entity": "crag",
      ":countryCodeRegion": `${countryCode}#${region}`,
    },
  };

  const crags = await dynamoDb.send(new QueryCommand(params))

  return crags;
};

export async function update(
  cragSlug: string,
  updateProps: {
    UpdateExpression: string;
    ExpressionAttributeNames: Record<string, string>;
    ExpressionAttributeValues: Record<string, any>;
  }
) {
  try {
    const params = {
      TableName: Resource.climbingtopos2.name,
      Key: {
        hk: cragSlug,
        sk: "metadata#",
      },
      ...updateProps,
    };

    const response = await dynamoDb.send(new UpdateCommand(params))

    return response;
  } catch (error) {
    console.error("Error updating crag", error);
    throw error;
  }
}
