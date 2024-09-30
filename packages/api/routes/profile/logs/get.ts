import { APIGatewayProxyEventV2, APIGatewayProxyHandler } from "aws-lambda";
import { logs } from "@/services";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEventV2
) => {
  try {
    const userSub = event.requestContext.authorizer?.iam.cognitoIdentity.identityId

    const { cragSlug, areaSlug, topoSlug, routeSlug } = {
      ...event.queryStringParameters,
    } as {
      cragSlug: string;
      areaSlug: string;
      topoSlug: string;
      routeSlug: string;
    };

    if (!userSub) {
      throw new Error("Cannot get profile logs, no usersub provided");
    }

    const userLogs = await logs.getUserLogs(
      userSub,
      cragSlug,
      areaSlug,
      topoSlug,
      routeSlug
    );

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userLogs),
    };
  } catch (error) {
    console.error("Error getting user logs", error);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: true }),
    };
  }
};
