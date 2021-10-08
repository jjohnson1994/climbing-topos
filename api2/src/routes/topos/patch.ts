import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import { TopoPatch } from "core/types";
import { UpdateTopoSchema } from "core/schemas";
import { crags, routes, topos } from "../../services";
import { getAuth0UserPublicDataFromEvent } from "../../utils/auth";
import {
  RequestValidator,
  validateRequest,
} from "../../utils/request-validator";

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

  const schema = UpdateTopoSchema();
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
    const { topoSlug } = event.pathParameters as {
      topoSlug: string;
    };

    const validationResponse = await validateRequest([isValidSchema], event);

    if (validationResponse !== true) {
      return validationResponse;
    }

    const topoPatch = JSON.parse(`${event.body}`) as TopoPatch;
    const user = await getAuth0UserPublicDataFromEvent(event);
    const topo = await topos.getTopoBySlug(topoSlug)
    const crag = await crags.getCragBySlug(topo.cragSlug, user);

    if (crag.managedBy.sub !== user.sub) {
      return {
        statusCode: 403,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: true,
          message:
            "Permission Error: You Do Not Have Permission to Patch this Topo",
        }),
      };
    }

    await topos.updateTopo(topo.cragSlug, topo.areaSlug, topoSlug, topoPatch);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
      }),
    };
  } catch (error) {
    console.error("Error updating topo", error);
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
