import { APIGatewayProxyEventV2, APIGatewayProxyHandler } from "aws-lambda";
import { lists } from "@/services";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEventV2
) => {
  try {
    const userSub = event.requestContext.authorizer?.iam.cognitoIdentity.identityId


    if (!userSub) {
      return {
        statusCode: 401,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success: false,
        }),
      }
    }

    const { slug } =
      event.pathParameters ??
      ({} as {
        slug: string;
      });

    if (slug) {
      const listReponse = await lists.getListBySlug(userSub, slug);

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listReponse),
      };
    } else {
      const userLists = await lists.getLists(userSub);

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userLists),
      };
    }
  } catch (error) {
    console.error("Error getting lists", error);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: true }),
    };
  }
};
