import { dynamodb, rdsDataService } from "../db";
import { Topo, TopoRequest } from "../../core/types";
import { nanoid } from "nanoid";

export async function createTopo(topoDetails: TopoRequest, userSub: string) {
  const topoSlug = nanoid();
  const { records } = await rdsDataService.executeStatement({
    database: process.env.RDS_DATABASE_NAME,
    resourceArn: `${process.env.RDS_DATABASE_RESOURCE_ARN}`,
    secretArn: `${process.env.RDS_DATABASE_SECRET_ARN}`,
    sql: `
      WITH areas AS (
        SELECT
          *
        FROM
          areas
        WHERE
          areas.slug = :area_slug
      )

      INSERT INTO topos (
        area_id,
        orientation_id,
        image,
        slug
      )
      SELECT
        areas.id,
        :orientation_id,
        :image,
        :slug
      FROM
        areas
      RETURNING *
    `,
    parameters: [
      {
        name: "area_slug",
        value: {
          "stringValue": topoDetails.areaSlug,
        },
      },
      {
        name: "orientation_id",
        value: {
          "stringValue": topoDetails.orientationId,
        }
      },
      {
        name: "image",
        value: {
          "stringValue": `${topoDetails.image}`
        },
      },
      {
        name: "slug",
        value: {
          "stringValue": `${topoSlug}`,
        },
      },
    ]
  }).promise();

  return records[0];
}

export async function getToposByCragSlug(
  cragSlug: string
): Promise<Topo[]> {
  const params = {
    TableName: String(process.env.DB),
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
  return response?.Items as Topo[];
}

export async function getTopo(cragSlug: string, areaSlug: string, topoSlug: string): Promise<Topo> {
  const params = {
    TableName: String(process.env.DB),
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
  const { records } = await rdsDataService.executeStatement({
    database: process.env.RDS_DATABASE_NAME,
    resourceArn: `${process.env.RDS_DATABASE_RESOURCE_ARN}`,
    secretArn: `${process.env.RDS_DATABASE_SECRET_ARN}`,
    sql: `
      SELECT
        areas.slug as "areaSlug",
        orientations.title as "orientationTitle",
        topos.area_id as "areaId",
        topos.id,
        topos.image,
        topos.orientation_id as "orientationId",
        topos.slug
      FROM
        topos
      LEFT JOIN areas
        ON areas.id = topos.area_id
      LEFT JOIN orientations
        ON orientations.id = topos.orientation_id
      WHERE
        topos.slug = :slug
    `,
    parameters: [
      {
        name: "slug",
        value: {
          "stringValue": slug,
        },
      },
    ]
  }).promise();

  return records[0];
}
