import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import { AreaRequest, UserPublicData } from "core/types";
import { areas, crags } from "../../services";
import { getUserPublicDataFromEvent } from "../../utils/auth";
import {
  RequestValidator,
  validateRequest,
} from "../../utils/request-validator";

const cragExists =
  (userSub: string): RequestValidator =>
  async (event: APIGatewayProxyEventV2) => {
    if (!event.body) {
      console.error("POST area request received without body", event);
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: true,
          message: "Invalid Request",
        }),
      };
    }

    const body = JSON.parse(event.body);
    const cragSlug = body.cragSlug;

    try {
      await crags.getCragBySlug(cragSlug, userSub);
      return true;
    } catch (error) {
      console.error("POST area request received for non-existing crag", event);
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: true,
          message: "Invalid Request",
        }),
      };
    }
  };

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  try {
    const user = await getUserPublicDataFromEvent(event);

    if (user.sub === false) {
      return {
        statusCode: 401,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success: false,
        }),
      }
    }

    const validationResponse = await validateRequest(
      [cragExists(user.sub)],
      event
    );

    if (validationResponse !== true) {
      return validationResponse;
    }

    const areaDetails = JSON.parse(`${event.body}`) as AreaRequest;
    const resp = await areas.createArea(areaDetails, user);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        ...resp,
      }),
    };
  } catch (error) {
    console.error("Error creating area", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        error: true,
      }),
    };
  }
};
