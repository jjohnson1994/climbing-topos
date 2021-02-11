import { dynamodb, rdsDataService } from '../db';
import { Log, LogRequest } from "../../core/types";

export async function createRouteLogs(logRequests: LogRequest[], userSub: string) {
  return rdsDataService.executeStatement({
    database: process.env.DATABASE_NAME,
    resourceArn: `${process.env.DATABASE_RESOURCE_ARN}`,
    secretArn: `${process.env.DATABASE_SECRET_ARN}`,
    sql: `
      WITH users AS (
        SELECT
          *
        FROM
          users
        WHERE
          users.auth_id = :user_sub
      ),

      new_logs AS (
        INSERT INTO logs (
          attempts,
          comment,
          date_logged,
          grade_suggested,
          grade_taken,
          route_id,
          stars,
          user_id
        )
        SELECT
          log_requests.attempts,
          log_requests.comment,
          log_requests."dateSent",
          routes.grade_index,
          log_requests."gradeTaken",
          routes.id,
          log_requests.stars,
          users.id
        FROM
          users,
          jsonb_to_recordset(:log_requests::jsonb) AS log_requests (
            attempts INT,
            comment VARCHAR,
            "dateSent" TIMESTAMP,
            "gradeTaken" INT,
            "routeSlug" VARCHAR,
            stars INT,
            tags JSONB
          )
        LEFT JOIN LATERAL (
          SELECT
            *
          FROM
            routes
          WHERE
            routes.slug = log_requests."routeSlug"
        ) as routes ON TRUE
        RETURNING *
      )

      SELECT
        new_logs.id,
        tags.tag_id
      FROM
        new_logs
      LEFT JOIN routes
      	ON new_logs.route_id = routes.id
      LEFT JOIN LATERAL (
        SELECT
          jsonb_array_elements(log_requests.tags) tag_id
        FROM
          jsonb_to_recordset(:log_requests::jsonb) AS log_requests (
            "routeSlug" VARCHAR,
            tags JSONB
          )
      ) as tags ON TRUE
    `,
    parameters: [
      {
        name: "log_requests",
        value: {
          "stringValue": JSON.stringify(logRequests),
        }
      },
      {
        name: "user_sub",
        value: {
          "stringValue": userSub,
        }
      }
    ]
  }).promise();
}

export async function getLogsByCragSlug(cragSlug: string): Promise<Log[]> {
  const params = {
    TableName: String(process.env.DB),
    KeyConditionExpression: "#hk = :hk AND begins_with(#sk, :sk)",
    ExpressionAttributeNames:{
      "#hk": "hk",
      "#sk": "sk"
    },
    ExpressionAttributeValues: {
      ":hk": cragSlug,
      ":sk": `log`
    }
  }

  const response = await dynamodb.query(params).promise()
  return response?.Items as Log[];
}

export async function getLogsForUser(userSub: string): Promise<Log[]> {
  const { records } = await rdsDataService.executeStatement({
    database: process.env.DATABASE_NAME,
    resourceArn: `${process.env.DATABASE_RESOURCE_ARN}`,
    secretArn: `${process.env.DATABASE_SECRET_ARN}`,
    sql: `
      SELECT
        areas.slug as "areaSlug",
        areas.title as "areaTitle",
        crags.osm_data->'address'->>'country' as "country",
        crags.osm_data->'address'->>'countryCode' as "countryCode",
        crags.osm_data->'address'->>'county' as "county",
        crags.osm_data->'address'->>'region' as "region",
        crags.osm_data->'address'->>'state' as "state",
        crags.slug as "cragSlug",
        crags.title as "cragTitle",
        grading_systems.title as "gradingSystemTitle",
        logs.attempts,
        logs.comment,
        logs.date_logged as "dateSent",
        logs.grade_suggested as "gradeSuggested",
        logs.grade_taken as "gradeTaken",
        logs.id, 
        logs.stars,
        rock_types.title as "rockTypeTitle",
        route_types.title as "routeTypeTitle",
        routes.grading_system_id as "gradingSystemId",
        routes.slug as "routeSlug",
        routes.title as "routeTitle",
        to_jsonb(array_remove(array_agg(DISTINCT route_tags.title), null)) as "tags",
        topos.slug as "topoSlug"
      FROM
        users
      LEFT JOIN logs
        ON logs.user_id = users.id
      LEFT JOIN routes
        ON routes.id = logs.route_id
      LEFT JOIN topos
        ON topos.id = routes.topo_id
      LEFT JOIN areas
        ON areas.id = topos.area_id
      LEFT JOIN crags
        ON crags.id = areas.crag_id
      LEFT JOIN grading_systems
        ON grading_systems.id = routes.grading_system_id
      LEFT JOIN rock_types
        ON rock_types.id = crags.rock_type_id
      LEFT JOIN route_types
        ON route_types.id = routes.route_type_id
      LEFT JOIN log_tags
        ON log_tags.log_id = logs.id
      LEFT JOIN route_tags
        ON route_tags.id = log_tags.tag_id
      WHERE
        users.auth_id = :user_sub
      GROUP BY
        logs.id,
        routes.id,
        topos.id,
        areas.id,
        crags.id,
        grading_systems.id,
        rock_types.id,
        route_types.id,
        log_tags.id,
        route_tags.id
    `,
    parameters: [
      {
        name: "user_sub",
        value: {
          "stringValue": userSub,
        }
      }
    ]
  }).promise();

  return records as Log[];
}
