import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import { LogRequest } from "core/types";
import { logs } from "../../services";
import { getAuth0UserPublicDataFromEvent } from "../../utils/auth";

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  try {
    const logsDetails = JSON.parse(`${event.body}`).logs as LogRequest[];
    const user = await getAuth0UserPublicDataFromEvent(event);
    await logs.logRoutes(logsDetails, user);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error("Error logging routes", error);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: true }),
    };
  }
};
