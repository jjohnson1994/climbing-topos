import { APIGatewayProxyEventV2, APIGatewayProxyHandler } from "aws-lambda";
import { areas } from "@/services";
import { getUserFromEvent } from "@/utils/auth";

export const handler: APIGatewayProxyHandler = async (
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

    const userSub = event.requestContext.authorizer?.iam.cognitoIdentity.identityId

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
