import * as yup from "yup";
import {APIGatewayProxyEventV2, APIGatewayProxyHandlerV2} from "aws-lambda";
import {NewListSchema} from "core/schemas";
import {lists} from "../../services";
import {getAuth0UserFromEvent} from "../../utils/auth";
import {RequestValidator} from "../../utils/request-validator";

const validateBody: RequestValidator = async (event: APIGatewayProxyEventV2) => {
  const schema = NewListSchema(yup);
  const isValid = await schema.isValid(JSON.parse(`${event.body}`));

  if (isValid) {
    return true;
  } else {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: true })
    }
  }
}

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  try {
    const bodyIsValid = await validateBody(event);

    if (bodyIsValid !== true) {
      return bodyIsValid;
    }

    const { sub } = await getAuth0UserFromEvent(event);
    const listDescription = JSON.parse(`${event.body}`);
    const newList = await lists.createList(sub, listDescription);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true, ...newList })
    }
  } catch (error) {
    console.error("Error creating new list", error);

    return {
      statuscode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: true })
    }
  }
}
