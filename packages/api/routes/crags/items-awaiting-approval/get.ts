import { APIGatewayProxyEventV2, APIGatewayProxyHandlern } from "aws-lambda";
import { crags } from "@/services";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEventV2
) => {
  try {
    if (!event.headers.authorization) {
      console.error(
        "POST crag request received without authorization header",
        event
      );
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: true,
          message: "Invalid Request",
        }),
      };
    }

    const userSub = event.requestContext.authorizer?.iam.cognitoIdentity.identityId

    if (!userSub) {
      return {
        statusCode: 401,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: true,
        }),
      };
    }

    const { slug } = (event.pathParameters || {}) as Record<string, string>;
    const crag = await crags.getCragBySlug(slug, userSub);

    if (crag.managedBy.sub !== userSub) {
      return {
        statusCode: 403,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: true }),
      };
    }

    const itemsAwaitingAproval = await crags.getCragItemsAwaitingAproval(
      crag.slug
    );

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(itemsAwaitingAproval),
    };
  } catch (error) {
    console.error("Error getting crag items pending approval", error);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: true }),
    };
  }
};
