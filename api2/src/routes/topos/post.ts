import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import { areas, topos } from "../../services";
import { getAuth0UserPublicDataFromEvent } from "../../utils/auth";
import { RequestValidator } from "../../utils/request-validator";

const areaExists =
  (userSub: string): RequestValidator =>
  async (event: APIGatewayProxyEventV2) => {
    try {
      const { areaSlug } = JSON.parse(`${event.body}`);
      const area = await areas.getAreaBySlug(areaSlug, userSub);

      if (area) {
        return true;
      } else {
        return {
          statusCode: 500,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            error: true,
            message: "Invalid Request",
          }),
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: true }),
      };
    }
  };

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  try {
    const user = await getAuth0UserPublicDataFromEvent(event);
    const areaExistsResponse = await areaExists(user.sub)(event);

    if (areaExistsResponse !== true) {
      return areaExistsResponse;
    }

    const topoDetails = JSON.parse(`${event.body}`);
    await topos.createTopo(topoDetails, user);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error("Error getting Topo", error);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: true }),
    };
  }
};
