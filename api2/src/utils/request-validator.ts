import { APIGatewayProxyEventV2 } from "aws-lambda";

export type RequestValidator = (
  event: APIGatewayProxyEventV2
) => Promise<true | RequestValidatorError>;

export type RequestValidatorError = {
  statusCode: number;
  headers: { "Content-Type": "application/json" },
  body: string;
};

export const validateRequest = async (
  validators: RequestValidator[],
  event: APIGatewayProxyEventV2
) => {
  const validateValidator = async (index: number): Promise<true | RequestValidatorError> => {
    if (index === validators.length) {
      return true;
    } else {
      const response = await validators[index](event);

      if (response === true) {
        return validateValidator(index + 1);
      }

      return response;
    }
  };

  return validateValidator(0);
};
