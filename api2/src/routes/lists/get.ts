import {APIGatewayProxyEventV2, APIGatewayProxyHandlerV2} from "aws-lambda";
import {lists} from "../../services";
import {getAuth0UserFromEvent} from "../../utils/auth";

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  try {
    const { sub } = await getAuth0UserFromEvent(event);
    const { slug } = event.pathParameters ?? {} as {
      slug: string;
    };

    if (slug) {
      const listReponse = await lists.getListBySlug(sub, slug);

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listReponse)
      }
    } else {
      const userLists = await lists.getLists(sub);

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userLists)
      }
    }
  } catch (error) {
    console.error("Error getting lists", error);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: true })
    }
  }
}
