import { APIGatewayProxyEventV2, APIGatewayProxyHandler } from "aws-lambda";
import { LogRequest } from "@climbingtopos/types";
import { logs } from "@/services";
import { getUserPublicDataFromEvent } from "@/utils/auth";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEventV2
) => {
  try {
    const logsDetails = JSON.parse(`${event.body}`).logs as LogRequest[];
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
