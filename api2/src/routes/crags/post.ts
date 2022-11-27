import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import { crags } from "../../services";
import { getUserPublicDataFromEvent, getUserSubFromAuthHeader } from "../../utils/auth";
import { RequestValidator } from "../../utils/request-validator";
import { NewCragSchema } from "core/schemas";

const validateBody: RequestValidator = async (
  event: APIGatewayProxyEventV2
) => {
  const schema = NewCragSchema();
  const isValid = await schema.isValid(JSON.parse(`${event.body}`));

  if (isValid) {
    return true;
  } else {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: true }),
    };
  }
};

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  try {
    const bodyIsValid = await validateBody(event);

    if (bodyIsValid !== true) {
      return bodyIsValid;
    }

    const cragDetails = JSON.parse(`${event.body}`);
    const user = await getUserPublicDataFromEvent(event);

    if (user.sub === false) {
      return {
        statusCode: 401,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success: false,
        }),
      }
    }

    const resp = await crags.createCrag(cragDetails, user);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        inserted: resp,
      }),
    };
  } catch (error) {
    console.error("Error creating crag", error);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: true }),
    };
  }
};
