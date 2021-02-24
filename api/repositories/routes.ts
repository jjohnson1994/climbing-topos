import { nanoid } from "nanoid";
import { dynamodb, rdsDataService } from '../db';
import { Route, RouteRequest } from "../../core/types";
import { createSlug } from "../helpers/slug";
import { ExpressionAttributeNameMap, UpdateExpression } from "aws-sdk/clients/dynamodb";

export async function createRoute(routeDescription: RouteRequest, userId: string): Promise<string> {
  const slug = createSlug(`${routeDescription.title}-${nanoid(5)}`);

  await rdsDataService.executeStatement({
    database: process.env.RDS_DATABASE_NAME,
    resourceArn: `${process.env.RDS_DATABASE_RESOURCE_ARN}`,
    secretArn: `${process.env.RDS_DATABASE_SECRET_ARN}`,
    sql: `
      WITH topos as (
        SELECT
          *
        FROM
          topos
        WHERE
          topos.slug = :topo_slug
      ),

      routes AS (
        INSERT INTO routes (
          description,
          drawing,
          grade_index,
          grading_system_id,
          route_type_id,
          slug,
          title,
          topo_id
        )
        SELECT
          :description,
          :drawing,
          :grade_index,
          :grading_systems_id,
          :route_type_id,
          :slug,
          :title,
          topos.id
        FROM
          topos
        RETURNING *
      ),

      route_tags AS (
        INSERT INTO route_route_tags (
          tag_id,
          route_id
        )
        SELECT
          tags::int,
          routes.id
        FROM
          jsonb_array_elements_text(:tags::jsonb) as tags,
          routes
      )

      SELECT * FROM routes
    `,
    parameters: [
      {
        name: "description",
        value: {
          "stringValue": routeDescription.description,
        }
      },
      {
        name: "drawing",
        value: {
          "stringValue": JSON.stringify(routeDescription.drawing),
        }
      },
      {
        name: "grade_index",
        value: {
          "longValue": parseInt(routeDescription.gradeIndex, 10),
        }
      },
      {
        name: "grading_systems_id",
        value: {
          "longValue": parseInt(routeDescription.gradingSystemId, 10),
        }
      },
      {
        name: "route_type_id",
        value: {
          "longValue": parseInt(routeDescription.routeTypeId, 10),
        }
      },
      {
        name: "slug",
        value: {
          "stringValue": slug,
        }
      },
      {
        name: "tags",
        value: {
          "stringValue": JSON.stringify(routeDescription.tags)
        },
      },
      {
        name: "title",
        value: {
          "stringValue": routeDescription.title,
        }
      },
      {
        name: "topo_slug",
        value: {
          "stringValue": routeDescription.topoSlug,
        }
      },
    ]
  }).promise();

  return slug;
}

export async function getRouteBySlug(routeSlug: string, userSub: string): Promise<Route> {
  const { records } = await rdsDataService.executeStatement({
    database: process.env.RDS_DATABASE_NAME,
    resourceArn: `${process.env.RDS_DATABASE_RESOURCE_ARN}`,
    secretArn: `${process.env.RDS_DATABASE_SECRET_ARN}`,
    sql: `
      SELECT
        routes.id,
        routes.description,
        routes.drawing,
        routes.grade_index as "gradeIndex",
        routes.grading_system_id as "gradingSystemId",
        routes.rating,
        routes.route_type_id as "routeTypeId",
        to_jsonb(array_remove(array_agg(DISTINCT route_tags.title), null)) as "tags",
        routes.title,
        topos.slug as "topoSlug",
        areas.title as "areaTitle",
        areas.slug as "areaSlug",
        crags.osm_data->'address'->>'country' as "country",
        crags.slug as "cragSlug",
        crags.title as "cragTitle",
        COUNT(logs) as "logsCount",
        to_jsonb(array_remove(array_agg(DISTINCT sibling_routes), null)) as "siblingRoutes",
        routes.slug,
        topos.id as "topoId",
        topos.image as "topoImage",
        to_jsonb(array_remove(array_agg(DISTINCT user_logs), null)) as "userLogs"
      FROM
        routes
      LEFT JOIN topos
        ON topos.id = routes.topo_id
      LEFT JOIN areas
        ON areas.id = topos.area_id
      LEFT JOIN crags
        ON crags.id = areas.crag_id
      LEFT JOIN route_route_tags
        ON route_route_tags.route_id = routes.id
      LEFT JOIN route_tags
        ON route_tags.id = route_route_tags.tag_id
      LEFT JOIN logs
        ON logs.route_id = routes.id
      LEFT JOIN LATERAL (
        SELECT
          *
        FROM
          routes as "subling_routes"
        WHERE
          subling_routes.topo_id = topos.id
        AND
          subling_routes.id != routes.id
      ) as "sibling_routes" ON TRUE
      LEFT JOIN LATERAL (
        SELECT
          logs.*
        FROM
          users
        LEFT JOIN logs
          ON logs.user_id = users.id
          AND logs.route_id = routes.id
        WHERE
          users.auth_id = :user_sub
      ) as "user_logs" ON TRUE
      WHERE
        routes.slug = :route_slug
      GROUP BY routes.id, crags.id, areas.id, topos.id
    `,
    parameters: [
      {
        name: "route_slug",
        value: {
          "stringValue": routeSlug,
        },
      },
      {
        name: "user_sub",
        value: {
          "stringValue": userSub || "NO_USER_SUB",
        },
      },
    ],
  }).promise();

  return records[0];
}

export async function getRoutesByCragSlug(
  cragSlug: string
): Promise<Route[]> {
  const params = {
    TableName: String(process.env.DB),
    KeyConditionExpression: "#hk = :hk AND begins_with(#sk, :sk)",
    ExpressionAttributeNames: {
      "#hk": "hk",
      "#sk": "sk"
    },
    ExpressionAttributeValues: {
      ":hk": cragSlug,
      ":sk": `route#`
    }
  }

  const response = await dynamodb.query(params).promise()
  return response?.Items as Route[];
}

export async function getRoutesByTopoSlug(
  cragSlug: string,
  areaSlug: string,
  topoSlug: string
): Promise<Route[]> {
  const params = {
    TableName: String(process.env.DB),
    KeyConditionExpression: "#hk = :hk AND begins_with(#sk, :sk)",
    ExpressionAttributeNames: {
      "#hk": "hk",
      "#sk": "sk"
    },
    ExpressionAttributeValues: {
      ":hk": cragSlug,
      ":sk": `route#area#${areaSlug}#topo#${topoSlug}`
    }
  }

  const response = await dynamodb.query(params).promise()
  return response?.Items as Route[];
}

export async function update(
  cragSlug: string,
  areaSlug: string,
  topoSlug: string,
  routeSlug: string,
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
      "sk": `route#area#${areaSlug}#topo#${topoSlug}#${routeSlug}`
    },
    ...updateProps
  }

  return dynamodb.update(params, (err) => {
    if (err) {
      console.error(err);
    }
  });
}
