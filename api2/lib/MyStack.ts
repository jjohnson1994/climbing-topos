import * as iam from "@aws-cdk/aws-iam";
import * as sst from "@serverless-stack/resources";
import { CorsHttpMethod } from "@aws-cdk/aws-apigatewayv2";
import { BucketAccessControl, HttpMethods, CorsRule } from "@aws-cdk/aws-s3";

export default class MyStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    const imagesBucket = new sst.Bucket(
      this,
      `climbing-topos-images-${process.env.NODE_ENV}`,
      {
        s3Bucket: {
          accessControl: BucketAccessControl.PUBLIC_READ,
          cors: <CorsRule[]>[
            {
              allowedHeaders: ["*"],
              allowedMethods: [HttpMethods.PUT],
              allowedOrigins: [
                "http://localhost:3000",
                "https://climbingtopos.com",
              ],
              maxAge: 30,
            },
          ],
        },
      }
    );

    const table = new sst.Table(this, "climbing-topos-2", {
      fields: {
        hk: sst.TableFieldType.STRING,
        sk: sst.TableFieldType.STRING,
        model: sst.TableFieldType.STRING,
        slug: sst.TableFieldType.STRING,
      },
      primaryIndex: { partitionKey: "hk", sortKey: "sk" },
      secondaryIndexes: {
        gsi1: {
          partitionKey: "model",
          sortKey: "sk",
        },
        gsi2: {
          partitionKey: "model",
          sortKey: "slug",
        },
      },
      stream: true,
    });

    const topicAreaOnInsert = new sst.Topic(this, "areaOnInsert", {
      subscribers: [
        new sst.Function(this, "areaOnInsertHandler", {
          handler: "src/events/area/areaOnInsert.handler",
          environment: {
            ALGOLIA_APP_ID: `${process.env.ALGOLIA_APP_ID}`,
            ALGOLIA_ADMIN_KEY: `${process.env.ALGOLIA_ADMIN_KEY}`,
            ALGOLIA_INDEX: `${process.env.ALGOLIA_INDEX}`,
            tableName: table.dynamodbTable.tableName,
          },
          permissions: [table],
        }),
      ],
    });

    const topicAreaOnModify = new sst.Topic(this, "areaOnModify", {
      subscribers: [
        new sst.Function(this, "areaOnModifyHandler", {
          handler: "src/events/area/areaOnModify.handler",
          environment: {
            ALGOLIA_APP_ID: `${process.env.ALGOLIA_APP_ID}`,
            ALGOLIA_ADMIN_KEY: `${process.env.ALGOLIA_ADMIN_KEY}`,
            ALGOLIA_INDEX: `${process.env.ALGOLIA_INDEX}`,
            tableName: table.dynamodbTable.tableName,
          },
          permissions: [table],
        }),
      ],
    });

    const topicAreaOnRemove = new sst.Topic(this, "areaOnRemove", {
      subscribers: [
        new sst.Function(this, "areaOnRemoveHandler", {
          handler: "src/events/area/areaOnRemove.handler",
          environment: {
            ALGOLIA_APP_ID: `${process.env.ALGOLIA_APP_ID}`,
            ALGOLIA_ADMIN_KEY: `${process.env.ALGOLIA_ADMIN_KEY}`,
            ALGOLIA_INDEX: `${process.env.ALGOLIA_INDEX}`,
            tableName: table.dynamodbTable.tableName,
          },
          permissions: [table],
        }),
      ],
    });

    const topicCragOnInsert = new sst.Topic(this, "cragOnInsert", {
      subscribers: [
        new sst.Function(this, "cragOnInsertHandler", {
          handler: "src/events/crag/cragOnInsert.handler",
          environment: {
            ALGOLIA_APP_ID: `${process.env.ALGOLIA_APP_ID}`,
            ALGOLIA_ADMIN_KEY: `${process.env.ALGOLIA_ADMIN_KEY}`,
            ALGOLIA_INDEX: `${process.env.ALGOLIA_INDEX}`,
            tableName: table.dynamodbTable.tableName,
          },
          permissions: [table],
        }),
      ],
    });

    const topicCragOnModify = new sst.Topic(this, "cragOnModify", {
      subscribers: [
        new sst.Function(this, "cragOnModifyHandler", {
          handler: "src/events/crag/cragOnModify.handler",
          environment: {
            ALGOLIA_APP_ID: `${process.env.ALGOLIA_APP_ID}`,
            ALGOLIA_ADMIN_KEY: `${process.env.ALGOLIA_ADMIN_KEY}`,
            ALGOLIA_INDEX: `${process.env.ALGOLIA_INDEX}`,
            tableName: table.dynamodbTable.tableName,
          },
          permissions: [table],
        }),
      ],
    });

    const topicCragOnRemove = new sst.Topic(this, "cragOnRemove", {
      subscribers: [
        new sst.Function(this, "cragOnRemoveHandler", {
          handler: "src/events/crag/cragOnRemove.handler",
          environment: {
            ALGOLIA_APP_ID: `${process.env.ALGOLIA_APP_ID}`,
            ALGOLIA_ADMIN_KEY: `${process.env.ALGOLIA_ADMIN_KEY}`,
            ALGOLIA_INDEX: `${process.env.ALGOLIA_INDEX}`,
            tableName: table.dynamodbTable.tableName,
          },
          permissions: [table],
        }),
      ],
    });

    const topicLogOnInsert = new sst.Topic(this, "logOnInsert", {
      subscribers: [
        new sst.Function(this, "logOnInsertHandler", {
          handler: "src/events/log/logOnInsert.handler",
          environment: {
            ALGOLIA_APP_ID: `${process.env.ALGOLIA_APP_ID}`,
            ALGOLIA_ADMIN_KEY: `${process.env.ALGOLIA_ADMIN_KEY}`,
            ALGOLIA_INDEX: `${process.env.ALGOLIA_INDEX}`,
            tableName: table.dynamodbTable.tableName,
          },
          permissions: [table],
        }),
      ],
    });

    const topicLogOnRemove = new sst.Topic(this, "logOnRemove", {
      subscribers: [
        new sst.Function(this, "logOnRemoveHandler", {
          handler: "src/events/log/logOnRemove.handler",
          environment: {
            ALGOLIA_APP_ID: `${process.env.ALGOLIA_APP_ID}`,
            ALGOLIA_ADMIN_KEY: `${process.env.ALGOLIA_ADMIN_KEY}`,
            ALGOLIA_INDEX: `${process.env.ALGOLIA_INDEX}`,
            tableName: table.dynamodbTable.tableName,
          },
          permissions: [table],
        }),
      ],
    });

    const topicRouteOnInsert = new sst.Topic(this, "routeOnInsert", {
      subscribers: [
        new sst.Function(this, "routeOnInsertHandler", {
          handler: "src/events/route/routeOnInsert.handler",
          environment: {
            ALGOLIA_APP_ID: `${process.env.ALGOLIA_APP_ID}`,
            ALGOLIA_ADMIN_KEY: `${process.env.ALGOLIA_ADMIN_KEY}`,
            ALGOLIA_INDEX: `${process.env.ALGOLIA_INDEX}`,
            tableName: table.dynamodbTable.tableName,
          },
          permissions: [table],
        }),
      ],
    });

    const topicRouteOnModify = new sst.Topic(this, "routeOnModify", {
      subscribers: [
        new sst.Function(this, "routeOnModifyHandler", {
          handler: "src/events/route/routeOnModify.handler",
          environment: {
            ALGOLIA_APP_ID: `${process.env.ALGOLIA_APP_ID}`,
            ALGOLIA_ADMIN_KEY: `${process.env.ALGOLIA_ADMIN_KEY}`,
            ALGOLIA_INDEX: `${process.env.ALGOLIA_INDEX}`,
            tableName: table.dynamodbTable.tableName,
          },
          permissions: [table],
        }),
      ],
    });

    const topicRouteOnRemove = new sst.Topic(this, "routeOnRemove", {
      subscribers: [
        new sst.Function(this, "routeOnRemoveHandler", {
          handler: "src/events/route/routeOnRemove.handler",
          environment: {
            ALGOLIA_APP_ID: `${process.env.ALGOLIA_APP_ID}`,
            ALGOLIA_ADMIN_KEY: `${process.env.ALGOLIA_ADMIN_KEY}`,
            ALGOLIA_INDEX: `${process.env.ALGOLIA_INDEX}`,
            tableName: table.dynamodbTable.tableName,
          },
          permissions: [table],
        }),
      ],
    });

    const topicTopoOnInsert = new sst.Topic(this, "topoOnInsert", {
      subscribers: [
        new sst.Function(this, "topoOnInsertHandler", {
          handler: "src/events/topo/topoOnInsert.handler",
          environment: {
            ALGOLIA_APP_ID: `${process.env.ALGOLIA_APP_ID}`,
            ALGOLIA_ADMIN_KEY: `${process.env.ALGOLIA_ADMIN_KEY}`,
            ALGOLIA_INDEX: `${process.env.ALGOLIA_INDEX}`,
            tableName: table.dynamodbTable.tableName,
          },
          permissions: [table],
        }),
      ],
    });

    const topicTopoOnModify = new sst.Topic(this, "topoOnModify", {
      subscribers: [
        new sst.Function(this, "topoOnModifyHandler", {
          handler: "src/events/topo/topoOnModify.handler",
          environment: {
            ALGOLIA_APP_ID: `${process.env.ALGOLIA_APP_ID}`,
            ALGOLIA_ADMIN_KEY: `${process.env.ALGOLIA_ADMIN_KEY}`,
            ALGOLIA_INDEX: `${process.env.ALGOLIA_INDEX}`,
            tableName: table.dynamodbTable.tableName,
          },
          permissions: [table],
        }),
      ],
    });

    const topicTopoOnRemove = new sst.Topic(this, "topoOnRemove", {
      subscribers: [
        new sst.Function(this, "topoOnRemoveHandler", {
          handler: "src/events/topo/topoOnRemove.handler",
          environment: {
            ALGOLIA_APP_ID: `${process.env.ALGOLIA_APP_ID}`,
            ALGOLIA_ADMIN_KEY: `${process.env.ALGOLIA_ADMIN_KEY}`,
            ALGOLIA_INDEX: `${process.env.ALGOLIA_INDEX}`,
            tableName: table.dynamodbTable.tableName,
          },
          permissions: [table],
        }),
      ],
    });

    const dynamoConsumer = new sst.Function(
      this,
      "climbing-topos-dynamodb-stream-consumer-2",
      {
        handler: "src/events/dynamodb/stream.handler",
        environment: {
          TOPIC_ARN_AREA_INSERT: topicAreaOnInsert.snsTopic.topicArn,
          TOPIC_ARN_AREA_MODIFY: topicAreaOnModify.snsTopic.topicArn,
          TOPIC_ARN_AREA_REMOVE: topicAreaOnRemove.snsTopic.topicArn,
          TOPIC_ARN_CRAG_INSERT: topicCragOnInsert.snsTopic.topicArn,
          TOPIC_ARN_CRAG_MODIFY: topicCragOnModify.snsTopic.topicArn,
          TOPIC_ARN_CRAG_REMOVE: topicCragOnRemove.snsTopic.topicArn,
          TOPIC_ARN_LOG_INSERT: topicLogOnInsert.snsTopic.topicArn,
          TOPIC_ARN_LOG_REMOVE: topicLogOnRemove.snsTopic.topicArn,
          TOPIC_ARN_ROUTE_INSERT: topicRouteOnInsert.snsTopic.topicArn,
          TOPIC_ARN_ROUTE_MODIFY: topicRouteOnModify.snsTopic.topicArn,
          TOPIC_ARN_ROUTE_REMOVE: topicRouteOnRemove.snsTopic.topicArn,
          TOPIC_ARN_TOPO_INSERT: topicTopoOnInsert.snsTopic.topicArn,
          TOPIC_ARN_TOPO_MODIFY: topicTopoOnModify.snsTopic.topicArn,
          TOPIC_ARN_TOPO_REMOVE: topicTopoOnRemove.snsTopic.topicArn,
        },
        permissions: [
          topicAreaOnInsert,
          topicAreaOnModify,
          topicAreaOnRemove,
          topicCragOnInsert,
          topicCragOnModify,
          topicCragOnRemove,
          topicLogOnInsert,
          topicLogOnRemove,
          topicRouteOnInsert,
          topicRouteOnModify,
          topicRouteOnRemove,
          topicTopoOnInsert,
          topicTopoOnModify,
          topicTopoOnRemove,
        ],
      }
    );

    table.addConsumers(this, { streamConsumer2: dynamoConsumer });

    // Create the HTTP API
    const api = new sst.Api(this, "Api", {
      cors: {
        allowMethods: [CorsHttpMethod.ANY],
        allowHeaders: [
          "Content-Type",
          "X-Amz-Date",
          "Authorization",
          "X-Api-Key",
          "X-Amz-Security-Token",
        ],
        allowOrigins:
          process.env.NODE_ENV === "dev"
            ? ["http://localhost:3000"]
            : ["https://climbingtopos.com"],
      },
      defaultAuthorizationType: sst.ApiAuthorizationType.AWS_IAM,
      defaultFunctionProps: {
        environment: {
          tableName: table.dynamodbTable.tableName,
          imageBucketName: imagesBucket.s3Bucket.bucketName,
          AUTH0_DOMAIN: `${process.env.AUTH0_DOMAIN}`,
        },
      },
      routes: {
        "POST /areas": "src/routes/areas/post.handler",
        "GET /areas/{areaSlug}": "src/routes/areas/get.handler",
        "PATCH /areas/{areaSlug}": "src/routes/areas/patch.handler",
        "GET /crags": "src/routes/crags/get.handler",
        "POST /crags": "src/routes/crags/post.handler",
        "PATCH /crags/{cragSlug}": "src/routes/crags/patch.handler",
        "GET /crags/{slug}": "src/routes/crags/get.handler",
        "GET /crags/{slug}/items-awaiting-approval":
          "src/routes/crags/items-awaiting-approval/get.handler",
        "GET /lists": "src/routes/lists/get.handler",
        "POST /lists": "src/routes/lists/post.handler",
        "PATCH /lists": "src/routes/lists/patch.handler",
        "GET /lists/{listSlug}": "src/routes/lists/get.handler",
        "POST /logs": "src/routes/logs/post.handler",
        "GET /profile/logs": "src/routes/profile/logs/get.handler",
        "GET /routes": "src/routes/routes/get.handler",
        "POST /routes": "src/routes/routes/post.handler",
        "PATCH /routes/{routeSlug}": "src/routes/routes/patch.handler",
        "GET /routes/logs": "src/routes/routes/logs/get.handler",
        "POST /topos": "src/routes/topos/post.handler",
        "PATCH /topos/{topoSlug}": "src/routes/topos/patch.handler",
        "GET /topos/{topoSlug}": "src/routes/topos/get.handler",
        "GET /pre-signed-upload-url":
          "src/routes/upload/pre-signed-upload-url/get.handler",
      },
    });

    api.attachPermissions([imagesBucket, table]);

    const auth = new sst.Auth(this, "climbing-topos-auth", {
      cognito: {
        userPool: {
          passwordPolicy: {
            minLength: 8,
            requireLowercase: false,
            requireUppercase: false,
            requireDigits: false,
            requireSymbols: false,
          },
          signInAliases: { email: true, username: true },
          standardAttributes: {
            email: {
              required: true,
            },
          },
        },
      },
    });

    auth.attachPermissionsForAuthUsers([
      api,
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["s3:PutObject", "s3:GetObject"],
        resources: [`${imagesBucket.bucketArn}/*`],
      }),
    ]);

    auth.attachPermissionsForUnauthUsers([
      api,
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["s3:GetObject"],
        resources: [`${imagesBucket.bucketArn}/*`],
      }),
    ]);

    this.addOutputs({
      ApiEndpoint: api.url,
      UserPoolId: auth.cognitoUserPool!.userPoolId,
      UserPoolClientId: auth.cognitoUserPoolClient!.userPoolClientId,
      IdentityPoolId: auth.cognitoCfnIdentityPool.ref,
    });
  }
}
