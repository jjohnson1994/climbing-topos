export type RequestValidator = (
  userSub?: string,
) => Promise<true | RequestValidatorError>;

export type RequestValidatorError = {
  statusCode: number;
  headers: { 'Content-Type': 'application/json' };
  body: string;
};

export const validateRequest = async (validators: RequestValidator[]) => {
  const validateValidator = async (
    index: number,
  ): Promise<true | RequestValidatorError> => {
    if (index === validators.length) {
      return true;
    } else {
      const response = await validators[index]();

      if (response === true) {
        return validateValidator(index + 1);
      }

      return response;
    }
  };

  return validateValidator(0);
};
