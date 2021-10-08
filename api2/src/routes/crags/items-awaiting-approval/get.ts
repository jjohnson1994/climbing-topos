import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import { crags } from "../../../services";
import { getAuth0UserFromEvent } from "../../../utils/auth";

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  try {
    const user = await getAuth0UserFromEvent(event);
    const { slug } = (event.pathParameters || {}) as Record<string, string>;

    if (!user.sub) {
      return {
        statusCode: 401,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: true }),
      };
    }

    const crag = await crags.getCragBySlug(slug, user);

    if (crag.managedBy.sub !== user.sub) {
      return {
        statusCode: 403,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: true }),
      };
    }

    const itemsAwaitingAproval = await crags.getCragItemsAwaitingAproval(crag.slug)

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(itemsAwaitingAproval),
    };
  } catch (error) {
    console.error("Error getting crag items pending approval", error);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: true }),
    };
  }
};
