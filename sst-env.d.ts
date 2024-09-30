/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    "AlgoliaAdminKey": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "AlgoliaAppId": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "AlgoliaIndex": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "Cognito": {
      "type": "sst.sst.Linkable"
      "userPoolClientId": string
      "userPoolId": string
    }
    "IdentityPool": {
      "id": string
      "type": "sst.aws.CognitoIdentityPool"
    }
    "UserPool": {
      "id": string
      "type": "sst.aws.CognitoUserPool"
    }
    "UserPoolClient": {
      "id": string
      "secret": string
      "type": "sst.aws.CognitoUserPoolClient"
    }
    "areaOnInsert": {
      "arn": string
      "type": "sst.aws.SnsTopic"
    }
    "areaOnModify": {
      "arn": string
      "type": "sst.aws.SnsTopic"
    }
    "areaOnRemove": {
      "arn": string
      "type": "sst.aws.SnsTopic"
    }
    "climbingtopos2": {
      "name": string
      "type": "sst.aws.Dynamo"
    }
    "climbingtopos2-api": {
      "type": "sst.aws.ApiGatewayV2"
      "url": string
    }
    "climbingtopos2-frontend": {
      "type": "sst.aws.Nextjs"
      "url": string
    }
    "climbingtopos2Images": {
      "name": string
      "type": "sst.aws.Bucket"
    }
    "cragOnInsert": {
      "arn": string
      "type": "sst.aws.SnsTopic"
    }
    "cragOnModify": {
      "arn": string
      "type": "sst.aws.SnsTopic"
    }
    "cragOnRemove": {
      "arn": string
      "type": "sst.aws.SnsTopic"
    }
    "logOnInsert": {
      "arn": string
      "type": "sst.aws.SnsTopic"
    }
    "logOnModify": {
      "arn": string
      "type": "sst.aws.SnsTopic"
    }
    "logOnRemove": {
      "arn": string
      "type": "sst.aws.SnsTopic"
    }
    "routeOnInsert": {
      "arn": string
      "type": "sst.aws.SnsTopic"
    }
    "routeOnModify": {
      "arn": string
      "type": "sst.aws.SnsTopic"
    }
    "routeOnRemove": {
      "arn": string
      "type": "sst.aws.SnsTopic"
    }
    "topoOnInsert": {
      "arn": string
      "type": "sst.aws.SnsTopic"
    }
    "topoOnModify": {
      "arn": string
      "type": "sst.aws.SnsTopic"
    }
    "topoOnRemove": {
      "arn": string
      "type": "sst.aws.SnsTopic"
    }
  }
}
export {}
