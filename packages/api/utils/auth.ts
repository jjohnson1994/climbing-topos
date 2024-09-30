import { APIGatewayProxyEventV2 } from "aws-lambda";
import { User, UserPublicData } from "@climbingtopos/types";
import { CognitoIdentityProviderClient, AdminGetUserCommand, ListUsersCommand, GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";

const cognito = new CognitoIdentityProviderClient()

const getUserAttributes = async (event: APIGatewayProxyEventV2) => {
  const authorizer = event.requestContext.authorizer as any;
  const identityId = authorizer.iam.cognitoIdentity.identityId;
  const userPoolId = authorizer.iam.cognitoIdentity.amr.find(
    (amr: string) => amr.includes('CognitoSignIn')
  ).split(':').shift().split('/').pop()
  const userPoolUserId = authorizer.iam.cognitoIdentity.amr.find(
    (amr: string) => amr.includes('CognitoSignIn')
  ).split(':').pop()

  const { Users: users } = await cognito.send(new ListUsersCommand({
    Filter: `sub = "${userPoolUserId}"`,
    UserPoolId: userPoolId,
    Limit: 1
  }))

  if (!users?.[0]) {
    throw new Error('Error: User not found')
  }

  const attributes = users[0].Attributes
  const email = attributes?.find(({ Name }) => Name === 'email')?.Value

  const username = users[0].Username

  if (!email) {
    throw new Error('Error: could not get user email')
  }

  return {
    sub: identityId,
    nickname: `${username}`, // TODO
    picture: 'todo', // TODO
    name: 'todo',
    email: email
  }
}

export const getUserFromEvent = async (
  event: APIGatewayProxyEventV2
): Promise<User | { sub: false }> => {
  try {
    const userAttributes = await getUserAttributes(event)

    return {
      sub: userAttributes.sub,
      nickname: userAttributes.nickname,
      picture: userAttributes.picture,
      email: userAttributes.email
    };

  } catch (error) {
    console.error('Error gettings user from event', error)

    return {
      sub: false
    }
  }
};

export const getUserPublicDataFromEvent = async (
  event: APIGatewayProxyEventV2
): Promise<UserPublicData | { sub: false }> => {
  try {
    const userAttributes = await getUserAttributes(event)

    return {
      sub: userAttributes.sub,
      nickname: userAttributes.nickname,
      picture: userAttributes.picture
    };
  } catch (_error) {
    return {
      sub: false
    }
  }
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
