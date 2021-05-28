import {APIGatewayProxyEventV2, APIGatewayProxyHandlerV2} from "aws-lambda";
import {routes} from "../../services";
import {getAuth0UserFromEvent} from "../../utils/auth";

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  try {
    const { cragSlug, areaSlug, topoSlug, routeSlug } = event.queryStringParameters as {
      cragSlug: string;
      areaSlug: string;
      topoSlug: string;
      routeSlug: string;
    };
    const user = await getAuth0UserFromEvent(event);
    const userSub = user ? user.sub : undefined;
    const route = await routes.getRouteBySlug(userSub, cragSlug, areaSlug, topoSlug, routeSlug);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(route)
    }
  } catch(error) {
    console.error("Error loading routes", error);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: true })
    }
  }
}

