import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import { AreaPatch } from "core/types";
import { UpdateAreaSchema } from "core/schemas";
import { areas, crags } from "../../services";
import { getAuth0UserSubFromAuthHeader } from "../../utils/auth";
import {
  RequestValidator,
  validateRequest,
} from "../../utils/request-validator";

const isValidAreaPatch: RequestValidator = async (
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

  const schema = UpdateAreaSchema();
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

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  try {
    const { areaSlug } = event.pathParameters as {
      areaSlug: string;
    };

    const validationResponse = await validateRequest([isValidAreaPatch], event);

    if (validationResponse !== true) {
      return validationResponse;
    }

    if (!event.headers.authorization) {
      console.error(
        "PATCH area request received without authorization header",
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

    const areaPatch = JSON.parse(`${event.body}`) as AreaPatch;
    const userSub = getAuth0UserSubFromAuthHeader(event.headers.authorization);
    const area = await areas.getAreaBySlug(areaSlug);
    const crag = await crags.getCragBySlug(area.cragSlug, userSub);

    if (crag.managedBy.sub !== userSub) {
      return {
        statusCode: 403,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: true,
          message:
            "Permission Error: You Do Not Have Permission to Patch this Area",
        }),
      };
    }

    await areas.updateArea(crag.slug, areaSlug, areaPatch);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
      }),
    };
  } catch (error) {
    console.error("Error updating area", error);
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
