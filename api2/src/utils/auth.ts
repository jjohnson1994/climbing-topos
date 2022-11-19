import { APIGatewayProxyEventV2 } from "aws-lambda";
import { User, UserPublicData } from "core/types";
import { inspect } from "util";
import { CognitoIdentity } from "aws-sdk"

export const getUserFromEvent = async (
  event: APIGatewayProxyEventV2
): Promise<User> => {
  const authorizer = event.requestContext.authorizer as any;
  const identityId = authorizer.iam.cognitoIdentity.identityId;

  const a = new CognitoIdentity({
    credentials: {
      accessKeyId: '',
      secretAccessKey: ''
    }
  })


  console.log(inspect(event, false, null, true))

  return {
    sub: identityId,
    nickname: 'todo', // TODO
    picture: 'todo', // TODO
    name: 'todo', // TODO
    email: 'todo' // TODO
  };
};

export const getUserPublicDataFromEvent = async (
  event: APIGatewayProxyEventV2
): Promise<UserPublicData> => {
  const authorizer = event.requestContext.authorizer as any;
  const identityId = authorizer.iam.cognitoIdentity.identityId;

  return {
    sub: identityId,
    nickname: 'todo', // TODO
    picture: 'todo', // TODO
  };
};

const getTokenFromAuthHeader = (authHeader: string) => {
  return authHeader.split(" ")[1];
};

export const getUserSubFromAuthHeader = (authorization: string) => {
  try {
    const token = getTokenFromAuthHeader(authorization);
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString()
    );
    const userSub = payload.sub;

    return userSub;
  } catch (error) {
    return null;
  }
};
