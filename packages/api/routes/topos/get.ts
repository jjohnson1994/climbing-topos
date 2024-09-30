import {APIGatewayProxyEventV2, APIGatewayProxyHandler} from "aws-lambda";
import {topos} from "@/services";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEventV2
) => {
  try {
    const { topoSlug } = event.pathParameters as {
      topoSlug: string;
    };

    const topo = await topos.getTopoBySlug(topoSlug);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(topo)
    }
  } catch(error) {
    console.error("Error getting Topo", error);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: true })
    }
  }
}
