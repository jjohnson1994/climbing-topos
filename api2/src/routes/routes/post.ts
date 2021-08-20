import {APIGatewayProxyEventV2, APIGatewayProxyHandlerV2} from "aws-lambda";
import {RouteRequest} from "core/types";
import {routes} from "../../services";
import {getAuth0UserFromEvent, getAuth0UserPublicDataFromEvent} from "../../utils/auth";

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  try {
    const routeDetails = JSON.parse(`${event.body}`) as RouteRequest;
    const user = await getAuth0UserPublicDataFromEvent(event);
    const resp = await routes.createRoute(routeDetails, user);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true, inserted: resp })
    }
  } catch(error) {
    console.error('Error creating route', error);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: true })
    }
  }   
}
