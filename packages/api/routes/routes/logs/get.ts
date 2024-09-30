import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import { logs } from "@/services";

type queryStringParams = {
  cragSlug: string;
  areaSlug: string;
  topoSlug: string;
  routeSlug: string;
  offset: string;
  limit: string;
}

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  try {
    const { cragSlug, areaSlug, topoSlug, routeSlug } = event.queryStringParameters as queryStringParams;
    const routeLogs = await logs.getLogs(cragSlug, areaSlug, topoSlug, routeSlug);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(routeLogs)
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

