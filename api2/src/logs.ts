import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";

export const post: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: `Hello, Bob! Your request was received at ${event.requestContext.time}.`,
  };
};
