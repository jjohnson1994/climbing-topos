import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import { NewListSchema } from "core/schemas";
import { lists } from "../../services";
import { getUserPublicDataFromEvent } from "../../utils/auth";
import { RequestValidator } from "../../utils/request-validator";

const validateBody: RequestValidator = async (
  event: APIGatewayProxyEventV2
) => {
  const schema = NewListSchema();
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

    const listDescription = JSON.parse(`${event.body}`);
    const newList = await lists.createList(user, listDescription);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true, ...newList }),
    };
  } catch (error) {
    console.error("Error creating new list", error);

    return {
      statuscode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: true }),
    };
  }
};
