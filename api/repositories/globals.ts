import { Globals } from "../../core/types";
import { rdsDataService } from "../db";

export async function getAllGlobals(): Promise<Globals> {
  console.log({rdsDataService});
  const { records } = await rdsDataService.executeStatement({
    database: process.env.RDS_DATABASE_NAME,
    resourceArn: `${process.env.RDS_DATABASE_RESOURCE_ARN}`,
    secretArn: `${process.env.RDS_DATABASE_SECRET_ARN}`,
    sql: `
      WITH access_types AS (
        SELECT coalesce(jsonb_agg(access_types), '[]'::jsonb) agg
        FROM access_types
      ),

      area_tags AS (
        SELECT coalesce(jsonb_agg(area_tags), '[]'::jsonb) agg
        FROM area_tags
      ),

      crag_tags AS (
        SELECT coalesce(jsonb_agg(crag_tags), '[]'::jsonb) agg
        FROM crag_tags
      ),

      grading_systems AS (
        SELECT coalesce(jsonb_agg(grading_systems), '[]'::jsonb) agg
        FROM grading_systems
      ),

      orientations AS (
        SELECT coalesce(jsonb_agg(orientations), '[]'::jsonb) agg
        FROM orientations
      ),

      rock_types AS (
        SELECT coalesce(jsonb_agg(rock_types), '[]'::jsonb) agg
        FROM rock_types
      ),

      route_tags AS (
        SELECT coalesce(jsonb_agg(route_tags), '[]'::jsonb) agg
        FROM route_tags
      ),

      route_types AS (
        SELECT
          coalesce(jsonb_agg(jsonb_build_object(
            'id', route_types.id,
            'title', route_types.title,
            'defaultGradingSystemId', route_type_default_grading_system.grading_system_id
          )), '[]'::jsonb) agg
        FROM
          route_types
        LEFT JOIN route_type_default_grading_system
          ON route_type_default_grading_system.grading_system_id = route_types.id
      )

      SELECT
        access_types.agg as "accessTypes",
        area_tags.agg as "areaTags",
        crag_tags.agg as "cragTags",
        grading_systems.agg as "gradingSystems",
        orientations.agg as "orientations",
        rock_types.agg as "rockTypes",
        route_tags.agg as "routeTags",
        route_types.agg as "routeTypes"
      FROM
        access_types,
        area_tags,
        crag_tags,
        grading_systems,
        orientations,
        rock_types,
        route_tags,
        route_types
    `, 
    parameters: [
      {
        name: "title",
        value: {
          "stringValue": "a",
        }
      }
    ]
  }).promise();

  return records[0];
}
