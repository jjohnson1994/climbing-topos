import { Resource } from "sst";
import { api } from "./api";
import { bucket } from "./storage";

const region = aws.getRegionOutput().name;

export const userPool = new sst.aws.CognitoUserPool("UserPool", {
  aliases: ["preferred_username", "email"]
});

export const userPoolClient = userPool.addClient("UserPoolClient");

export const identityPool = new sst.aws.CognitoIdentityPool("IdentityPool", {
  userPools: [
    {
      userPool: userPool.id,
      client: userPoolClient.id,
    },
  ],
  permissions: {
    authenticated: [
      {
        actions: ["s3:*"],
        resources: [
          $concat(bucket.arn, "/private/${cognito-identity.amazonaws.com:sub}/*"),
        ],
      },
      {
        actions: [
          "execute-api:*",
        ],
        resources: ['*'],
      },
      //     {
      //     actions: [
      //       "execute-api:*",
      //     ],
      //     resources: [
      //       $concat(
      //         "arn:aws:execute-api:",
      //         region,
      //         ":",
      //         aws.getCallerIdentityOutput({}).accountId,
      //         ":",
      //         api.nodes.api.id,
      //         "/*/*/*"
      //       ),
      //     ],
      //   }
      // {
      // },
    ],
    unauthenticated: [
      {
        actions: [
          "execute-api:*",
        ],
        resources: ['*'],
      },
    //     {
    //     actions: [
    //       "execute-api:*",
    //     ],
    //     resources: [
    //       $concat(
    //         "arn:aws:execute-api:",
    //         region,
    //         ":",
    //         aws.getCallerIdentityOutput({}).accountId,
    //         ":",
    //         api.nodes.api.id,
    //         "/*/*/*"
    //       ),
    //     ],
    //   }
    ]
  },
});
