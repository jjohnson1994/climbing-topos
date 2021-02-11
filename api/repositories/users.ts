import { rdsDataService } from "../db";

export async function createUser(userSub: string) {
  await rdsDataService.executeStatement({
    database: process.env.RDS_DATABASE_NAME,
    resourceArn: `${process.env.RDS_DATABASE_RESOURCE_ARN}`,
    secretArn: `${process.env.RDS_DATABASE_SECRET_ARN}`,
    sql: `
      INSERT INTO users (
        auth_id
      )
      SELECT
        :user_sub
      ON CONFLICT DO NOTHING
    `,
    parameters: [
      {
        name: "user_sub",
        value: {
          "stringValue": userSub,
        }
      }
    ],
  }).promise();
}
