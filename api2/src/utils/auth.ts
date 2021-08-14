import { APIGatewayProxyEventV2 } from "aws-lambda";
import { Auth0User } from "core/types";
import fetch from 'node-fetch';

export const getAuth0UserFromEvent = async (event: APIGatewayProxyEventV2): Promise<Auth0User> => {
  try {
    const { authorization } = event.headers;

    if (authorization) {
      const userInfoResponse = await fetch(`${process.env.AUTH0_DOMAIN}userinfo`, {
        headers: {
          Authorization: `${authorization}`
        }
      })

      if (userInfoResponse.status !== 200) {
        throw new Error("Auth0 did not respond with 200");
      }

      const userInfo = await userInfoResponse.json();

      return userInfo;
    } else {
      return {
        sub: '',
        name: '',
        updated_at: '',
        email: '',
        email_verified: false,
        picture: '',
        nickname: '',
      };
    }
  } catch(error) {
    console.error("Error getting Auth0 user info", error);
    throw new Error("Error getting Auth0 user info")
  }
}
