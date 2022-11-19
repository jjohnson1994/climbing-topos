import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import { CragPatch } from "core/types";
import { UpdateCragSchema } from "core/schemas";
import { crags } from "../../services";
import { getUserSubFromAuthHeader } from "../../utils/auth";
import {
  RequestValidator,
  validateRequest,
} from "../../utils/request-validator";

const isValidCragPatch: RequestValidator = async (
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

  const schema = UpdateCragSchema();
  const isValid = await schema.isValid(JSON.parse(event.body), { strict: true });

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
    if (!event.headers.authorization) {
      console.error(
        "PATCH crag request received without authorization header",
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

    const { cragSlug } = event.pathParameters as {
      cragSlug: string;
    };

    const validationResponse = await validateRequest([isValidCragPatch], event);

    if (validationResponse !== true) {
      return validationResponse;
    }

    const cragPatch = JSON.parse(`${event.body}`) as CragPatch;
    const userSub = getUserSubFromAuthHeader(event.headers.authorization);
    const crag = await crags.getCragBySlug(cragSlug, userSub);

    if (crag.managedBy.sub !== userSub) {
      return {
        statusCode: 403,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: true,
          message: "Permission Error: You Do Not Have Permission to Patch this Crag",
        }),
      }
    }

    await crags.updateCrag(cragSlug, cragPatch);

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
