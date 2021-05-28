import { SNSHandler } from "aws-lambda";

export const handler: SNSHandler = async () => {
  try {
    throw new Error("Error in log on remove, handler not implemented");
  } catch (error) {
    console.error("Error logOnRemove", error);
    throw new Error(error);
  }
};
