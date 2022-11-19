import {APIGatewayProxyEventV2, APIGatewayProxyHandlerV2} from "aws-lambda";
import {logs} from "../../../services";
import {getUserFromEvent} from "../../../utils/auth";

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  try {
    const user = await getUserFromEvent(event);
    const { cragSlug, areaSlug, topoSlug, routeSlug } = {
      ...event.queryStringParameters,
    } as {
      cragSlug: string;
      areaSlug: string;
      topoSlug: string;
      routeSlug: string;
    };

    if (!user.sub) {
      throw new Error("Cannot get profile logs, no usersub provided");
    }

    const userLogs = await logs.getUserLogs(
      user.sub,
      cragSlug,
      areaSlug,
      topoSlug,
      routeSlug
    );

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userLogs),
    };
  } catch (error) {
    console.error("Error getting user logs", error);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: true }),
    };
  }
};
