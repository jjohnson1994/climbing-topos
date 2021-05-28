import {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
} from "aws-lambda";
import {AreaRequest} from "core/types";
import { areas, crags } from "../../services";
import { getAuth0UserFromEvent } from "../../utils/auth";
import { RequestValidator, validateRequest } from "../../utils/request-validator";

const cragExists: RequestValidator = async (event: APIGatewayProxyEventV2) => {
  if (!event.body) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: true,
        message: "Invalid Request: No body"
      }),
    };
  }

  const body = JSON.parse(event.body);
  const cragSlug = body.cragSlug;

  try {
    const user = await getAuth0UserFromEvent(event);
    await crags.getCragBySlug(cragSlug, user);
    return true;
  } catch (error) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: true,
        message: "Invalid Request: Crag does not exists",
      })
    };
  }
};

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  try {
    const validationResponse = await validateRequest(
      [ cragExists ],
      event,
    );

    if (validationResponse !== true) {
      return validationResponse;
    }

    const areaDetails = JSON.parse(`${event.body}`) as AreaRequest;
    const user = await getAuth0UserFromEvent(event);
    const resp = await areas.createArea(areaDetails, user.sub);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        ...resp
      })
    };
  } catch(error) {
    console.error('Error creating area', error);
    return {
      statusCode: 200,
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        error: true
      })
    };
  }
}
