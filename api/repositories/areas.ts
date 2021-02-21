import { dynamodb, rdsDataService } from '../db';
import { Area, AreaRequest } from "../../core/types";
import { ExpressionAttributeNameMap, UpdateExpression } from "aws-sdk/clients/dynamodb";

export async function createArea(areaDescription: AreaRequest, userSub: string) {
  const { records } = await rdsDataService.executeStatement({
    database: process.env.RDS_DATABASE_NAME,
    resourceArn: `${process.env.RDS_DATABASE_RESOURCE_ARN}`,
    secretArn: `${process.env.RDS_DATABASE_SECRET_ARN}`,
    sql: `
      WITH crags AS (
        SELECT
          *
        FROM
          crags
        WHERE
          crags.slug = :slug
      ),

      new_area AS (
        INSERT INTO areas (
          title,
          approach_details,
          description,
          latitude,
          longitude,
          slug,
          crag_id
        )
        SELECT
          :title,
          :approach_details,
          :description,
          :latitude,
          :longitude,
          new_area_slug,
          crags.id
        FROM
          crags,
          slugify(:title) as new_area_slug
        RETURNING *
      ),

      area_tags AS (
        INSERT INTO area_area_tags (
          tag_id,
          area_id
        )
        SELECT
          tags::int,
          new_area.id
        FROM
          jsonb_array_elements_text(:tags::jsonb) as tags,
          new_area
      )

      SELECT * FROM new_area
    `,
    parameters: [
      {
        name: "title",
        value: {
          "stringValue": areaDescription.title,
        },
      },
      {
        name: "approach_details",
        value: {
          "stringValue": areaDescription.approachDetails,
        }
      },
      {
        name: "description",
        value: {
          "stringValue": areaDescription.description,
        },
      },
      {
        name: "latitude",
        value: {
          "stringValue": `${areaDescription.latitude}`,
        },
      },
      {
        name: "longitude",
        value: {
          "stringValue": `${areaDescription.longitude}`,
        },
      },
      {
        name: "slug",
        value: {
          "stringValue": areaDescription.cragSlug,
        }
      },
      {
        name: "tags",
        value: {
          "stringValue": JSON.stringify(areaDescription.tags),
        }
      },
    ]
  }).promise();

  return {
    slug: records[0].slug,
  };
}

export async function getAreasByCragSlug(cragSlug: string): Promise<Area[]> {
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
  return crag?.Items as Area[];
}

export async function getAreaBySlug(slug: string, userSub: string): Promise<Area> {
  const { records } = await rdsDataService.executeStatement({
    database: process.env.RDS_DATABASE_NAME,
    resourceArn: `${process.env.RDS_DATABASE_RESOURCE_ARN}`,
    secretArn: `${process.env.RDS_DATABASE_SECRET_ARN}`,
    sql: `
      SELECT
        areas.approach_details as "approachDetails",
        areas.description,
        areas.latitude,
        areas.longitude,
        areas.slug,
        areas.title,
        crags.slug as "cragSlug",
        to_jsonb(array_remove(array_agg(DISTINCT area_tags.title), null)) as "tags",
        to_jsonb(array_remove(array_agg(DISTINCT topos), null)) as "topos",
        to_jsonb(array_remove(array_agg(DISTINCT routes), null)) as "routes",
        to_jsonb(array_remove(array_agg(DISTINCT user_logs), null)) as "userLogs"
      FROM
        areas
      LEFT JOIN area_area_tags
        ON area_area_tags.area_id = areas.id
      LEFT JOIN area_tags
        ON area_tags.id = area_area_tags.tag_id
      LEFT JOIN crags
        ON crags.id = areas.crag_id
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
          crags.slug as "cragSlug",
          areas.slug as "areaSlug",
          topos.slug as "topoSlug",
          routes.description,
          routes.drawing,
          routes.grade_index as "gradeIndex",
          routes.grading_system_id as "gradingSystemId",
          routes.id,
          routes.rating,
          routes.route_type_id as "routeTypeId",
          routes.slug,
          routes.title,
          routes.topo_id as "topoId"
        FROM
          routes
        WHERE
          routes.topo_id = topos.id
      ) as "routes" ON TRUE
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
        areas.slug = :slug
      GROUP BY
        areas.id,
        crags.id
    `,
    parameters: [
      {
        name: "slug",
        value: {
          "stringValue": slug,
        }
      },
      {
        name: "user_sub",
        value: {
          "stringValue": userSub,
        }
      }
    ],
  }).promise();

  return records[0];
}

export async function update(
  cragSlug: string,
  areaSlug: string,
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
      "sk": `area#${areaSlug}#`,
    },
    ...updateProps
  }

  return dynamodb.update(params, (err) => {
    if (err) {
      console.error(err);
    }
  });
}
