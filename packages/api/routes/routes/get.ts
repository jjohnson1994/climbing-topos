import { APIGatewayProxyEventV2, APIGatewayProxyHandler } from "aws-lambda";
import { routes } from "@/services";
import { getUserFromEvent } from "@/utils/auth";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEventV2
) => {
  try {
    const { cragSlug, areaSlug, topoSlug, routeSlug } = event.queryStringParameters as {
      cragSlug: string;
      areaSlug: string;
      topoSlug: string;
      routeSlug: string;
    };

    const userSub = event.requestContext.authorizer?.iam.cognitoIdentity.identityId

    const route = await routes.listRoutes(userSub || '', cragSlug, areaSlug, topoSlug, routeSlug);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(route)
    }
  } catch(error) {
    console.error("Error loading routes", error);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: true })
    }
  }
}

