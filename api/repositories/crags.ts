import { ExpressionAttributeNameMap, UpdateExpression } from "aws-sdk/clients/dynamodb";
import { Crag, CragBrief, CragRequest } from '../../core/types';
import { dynamodb, rdsDataService } from '../db';

export const createCrag = async (cragDetails: CragRequest, ownerUserSub: string) => {
  const { records } = await rdsDataService.executeStatement({
    database: process.env.RDS_DATABASE_NAME,
    resourceArn: `${process.env.RDS_DATABASE_RESOURCE_ARN}`,
    secretArn: `${process.env.RDS_DATABASE_SECRET_ARN}`,
    sql: `
      WITH new_crag AS (
        INSERT INTO crags (
          access_details,
          access_type_id,
          approach_details,
          description,
          latitude,
          longitude,
          osm_data,
          rock_type_id,
          slug,
          title
        )
        SELECT
          :access_details,
          :access_type_id,
          :approach_details,
          :description,
          :latitude,
          :longitude,
          :osm_data::jsonb,
          :rock_type_id,
          slug,
          :title
        FROM
          slugify(:title) as slug
        RETURNING *
      ),

      car_parks AS (
        INSERT INTO car_parks (
          crag_id,
          description,
          latitude,
          longitude,
          title
        )
        SELECT
          new_crag.id,
          new_car_park->>'description',
          new_car_park->>'latitude',
          new_car_park->>'longitude',
          new_car_park->>'title'
        FROM
          new_crag,
          jsonb_array_elements(:car_parks::jsonb) as new_car_park
        RETURNING *
      ),

      crag_tags AS (
        INSERT INTO crag_crag_tags (
          tag_id,
          crag_id
        )
        SELECT
          tags::int,
          new_crag.id
        FROM
          jsonb_array_elements_text(:tags::jsonb) as tags,
          new_crag
      )

      SELECT * FROM new_crag
    `,
    parameters: [
      {
        name: "access_details",
        value: {
          "stringValue": cragDetails.accessDetails,
        },
      },
      {
        name: "access_type_id",
        value: {
          "longValue": parseInt(cragDetails.accessTypeId, 10),
        },
      },
      {
        name: "approach_details",
        value: {
          "stringValue": cragDetails.approachDetails,
        },
      },
      {
        name: "car_parks",
        value: {
          "stringValue": JSON.stringify(cragDetails.carParks),
        }
      },
      {
        name: "description",
        value: {
          "stringValue": cragDetails.description,
        },
      },
      {
        name: "latitude",
        value: {
          "stringValue": `${cragDetails.latitude}`,
        },
      },
      {
        name: "longitude",
        value: {
          "stringValue": `${cragDetails.longitude}`,
        },
      },
      {
        name: "tags",
        value: {
          "stringValue": JSON.stringify(cragDetails.tags),
        }
      },
      {
        name: "osm_data",
        value: {
          "stringValue": JSON.stringify(cragDetails.osmData),
        },
      },
      {
        name: "rock_type_id",
        value: {
          "longValue": parseInt(cragDetails.rockTypeId, 10),
        },
      },
      {
        name: "title",
        value: {
          "stringValue": cragDetails.title,
        },
      },
    ]
  }).promise();

  return {
    slug: records[0].slug,
  };
}

export async function getAllCrags(userSub: string): Promise<CragBrief[]> {
  const { records } = await rdsDataService.executeStatement({
    database: process.env.RDS_DATABASE_NAME,
    resourceArn: `${process.env.RDS_DATABASE_RESOURCE_ARN}`,
    secretArn: `${process.env.RDS_DATABASE_SECRET_ARN}`,
    sql: `
      SELECT
        crags.slug,
        crags.title,
        crags.osm_data as "osmData",
        crags.latitude,
        crags.longitude,
        COUNT(DISTINCT areas) as "areaCount",
        COUNT(DISTINCT routes) as "routeCount",
        COUNT(DISTINCT logs) as "logCount"
      FROM
        crags
      LEFT JOIN areas
        ON areas.crag_id = crags.id
      LEFT JOIN topos
        ON topos.area_id = areas.id
      LEFT JOIN routes
        ON routes.topo_id = topos.id
      LEFT JOIN logs
        ON logs.route_id = routes.id
      GROUP BY crags.id
    `,
  }).promise();

  return records;
}

export const getCragBySlug = async (slug: string, userSub: string): Promise<Crag> => {
  const { records } = await rdsDataService.executeStatement({
    database: process.env.RDS_DATABASE_NAME,
    resourceArn: `${process.env.RDS_DATABASE_RESOURCE_ARN}`,
    secretArn: `${process.env.RDS_DATABASE_SECRET_ARN}`,
    sql: `
      SELECT
        crags.access_details as "accessDetails",
        crags.approach_details as "approachDetails",
        crags.description,
        crags.latitude,
        crags.longitude,
        crags.osm_data as "osmData",
        crags.slug,
        crags.title,
        access_types.title as "access",
        rock_types.title as "rockTypeTitle",
        to_jsonb(array_remove(array_agg(DISTINCT areas), null)) as "areas",
        to_jsonb(array_remove(array_agg(DISTINCT topos), null)) as "topos",
        to_jsonb(array_remove(array_agg(DISTINCT routes), null)) as "routes",
        to_jsonb(array_remove(array_agg(DISTINCT user_logs), null)) as "userLogs",
        to_jsonb(array_remove(array_agg(DISTINCT car_parks), null)) as "carParks"
      FROM 
        crags
      LEFT JOIN access_types
        ON access_types.id = crags.access_type_id
      LEFT JOIN rock_types
        ON rock_types.id = crags.rock_type_id
      LEFT JOIN car_parks
        ON car_parks.crag_id = crags.id
      LEFT JOIN LATERAL (
        SELECT
          areas.*,
          to_jsonb(array_remove(array_agg(DISTINCT area_tags.title), null)) as "tags"
        FROM
          areas
        LEFT JOIN area_area_tags
          ON area_area_tags.area_id = areas.id
        LEFT JOIN area_tags
          ON area_tags.id = area_area_tags.tag_id
        WHERE
          areas.crag_id = crags.id
        GROUP BY
          areas.id
      ) as "areas" ON TRUE
      LEFT JOIN LATERAL (
        SELECT
          topos.area_id as "areaId",
          topos.id,
          topos.image,
          topos.orientation_id as "orientationId",
          topos.slug
        FROM
          topos
        WHERE
          topos.area_id = areas.id
      ) as "topos" ON TRUE
      LEFT JOIN LATERAL (
        SELECT
          routes.description,
          routes.drawing,
          routes.grade_index as "gradeIndex",
          routes.grading_system_id as "gradingSystemId",
          routes.id,
          routes.rating,
          routes.route_type_id as "routeTypeId",
          routes.slug,
          routes.title,
          routes.topo_id as "topoId",
          topos.slug as "topoSlug",
          areas.slug as "areaSlug",
          crags.slug as "cragSlug"
        FROM
          routes
        WHERE
          routes.topo_id = topos.id
      ) as "routes" ON TRUE
      LEFT JOIN logs
        ON logs.route_id = routes.id
      LEFT JOIN LATERAL (
        SELECT
          DISTINCT routes.slug as "routeSlug"
        FROM
          logs,
          users,
          routes
        WHERE
          users.auth_id = :user_sub
        AND
          logs.user_id = users.id
        AND
          logs.route_id = routes.id
        AND
          routes.id = logs.route_id
        AND
          routes.topo_id = topos.id
      ) as "user_logs" ON TRUE
      WHERE
        crags.slug = :slug
      GROUP BY crags.id, access_types.id, rock_types.id
    `,
    parameters: [
      {
        name: "slug",
        value: {
          "stringValue": slug
        }
      },
      {
        name: "user_sub",
        value: {
          "stringValue": userSub || "NO_USER_SUB",
        }
      }
    ]
  }).promise();

  return records[0] as Crag;
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

export async function update(
  cragSlug: string,
  updateProps: {
    UpdateExpression: UpdateExpression;
    ExpressionAttributeNames: ExpressionAttributeNameMap;
    ExpressionAttributeValues: { [key: string]: any };
  }
) {
  const params = {
    TableName: String(process.env.DB),
    Key: {
      "hk": cragSlug,
      "sk": "metadata#"
    },
    ...updateProps
  }

  return dynamodb.update(params, (err) => {
    if (err) {
      console.error(err);
    }
  });
}
