import { APIGatewayProxyEventV2, APIGatewayProxyHandler } from "aws-lambda";
import { RoutePatch } from "@climbingtopos/types";
import { UpdateRouteScheme } from "@climbingtopos/schemas";
import { crags, routes } from "@/services";
import {
  RequestValidator,
  validateRequest,
} from "@/utils/request-validator";

const isValidSchema: RequestValidator = async (
  event: APIGatewayProxyEventV2
) => {
  if (!event.body) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: true,
        message: "Invalid Request: No body",
      }),
    };
  }

  const schema = UpdateRouteScheme();
  const isValid = await schema.isValid(JSON.parse(event.body), {
    strict: true,
  });

  if (!isValid) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: true,
        message: "Invalid Request: Body Does Not Match Schema",
      }),
    };
  }

  return true;
};

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEventV2
) => {
  try {
    if (!event.headers.authorization) {
      console.error(
        "PATCH route request received without authorization header",
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

    const { routeSlug } = event.pathParameters as {
      routeSlug: string;
    };

    const validationResponse = await validateRequest([isValidSchema], event);

    if (validationResponse !== true) {
      return validationResponse;
    }

    const routePatch = JSON.parse(`${event.body}`) as RoutePatch;
    const userSub = event.requestContext.authorizer?.iam.cognitoIdentity.identityId
    const route = await routes.getRouteBySlug(routeSlug);
    const crag = await crags.getCragBySlug(route.cragSlug, userSub);

    if (crag.managedBy.sub !== userSub) {
      return {
        statusCode: 403,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: true,
          message:
            "Permission Error: You Do Not Have Permission to Patch this Route",
        }),
      };
    }

    await routes.updateRoute(
      route.cragSlug,
      route.areaSlug,
      route.topoSlug,
      routeSlug,
      routePatch
    );

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
      }),
    };
  } catch (error) {
    console.error("Error updating route", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        error: true,
        message: error.message,
      }),
    };
  }
};
