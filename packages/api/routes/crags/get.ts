import { APIGatewayProxyEventV2, APIGatewayProxyHandler } from "aws-lambda";
import { crags } from "@/services";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEventV2
) => {
  try {
    const userSub = event.requestContext.authorizer?.iam.cognitoIdentity.identityId

    const {
      sortBy,
      sortOrder,
      limit = "10",
      offset = "0",
    } = event.queryStringParameters || ({} as Record<string, string>);

    const { cragSlug } =
      event.pathParameters ||
      ({} as {
        cragSlug: string;
      });

    if (cragSlug) {
      const crag = await crags.getCragBySlug(cragSlug, userSub || '');

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(crag),
      };
    } else {
      const allCrags = await crags.getAllCrags(
        userSub || '',
        sortBy,
        sortOrder,
        parseInt(limit, 10),
        parseInt(offset, 10)
      );

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(allCrags),
      };
    }
  } catch (error) {
    console.error("Error getting crags", error);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: true }),
    };
  }
};
