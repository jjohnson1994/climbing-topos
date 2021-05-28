import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import { areas } from "../../services";
import { getAuth0UserFromEvent } from "../../utils/auth";

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  try {
    const { areaSlug } = event.pathParameters as {
      areaSlug: string;
    };

    if (!areaSlug) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: 400,
          message: "Missing areaSlug parameter",
        }),
      };
    }

    const user = await getAuth0UserFromEvent(event);
    const userSub = user ? user.sub : undefined;
    const area = await areas.getAreaBySlug(areaSlug, userSub);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(area),
    };
  } catch (error) {
    console.error("Error getting Area", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: true }),
    };
  }
};
