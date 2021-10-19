import {APIGatewayProxyEventV2, APIGatewayProxyHandlerV2} from "aws-lambda";
import {crags} from "../../services";
import {getAuth0UserFromEvent, getAuth0UserSubFromAuthHeader} from "../../utils/auth";

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  try {
    const userSub = event.headers.authorization
      ? getAuth0UserSubFromAuthHeader(event.headers.authorization)
      : null

    const { sortBy, sortOrder, limit = '10', offset = '0' } = event.queryStringParameters
      || {} as Record<string, string>;
    const { slug } = event.pathParameters || {} as {
      slug: string;
    };

    if (slug) {
      const crag = await crags.getCragBySlug(slug, userSub);
      
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(crag),
      }
    } else {
      const allCrags = await crags.getAllCrags(
        userSub,
        sortBy,
        sortOrder,
        parseInt(limit, 10),
        parseInt(offset, 10),
      );

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(allCrags),
      }
    }
  } catch (error) {
    console.error('Error getting crags', error);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: true })
    }
  }
}
