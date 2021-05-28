import * as sst from "@serverless-stack/resources";
import { CorsHttpMethod } from "@aws-cdk/aws-apigatewayv2";
import * as apigAuthorizers from "@aws-cdk/aws-apigatewayv2-authorizers";
import { BucketAccessControl, HttpMethods, CorsRule } from "@aws-cdk/aws-s3";

function publicFunction(handlerPath: string) {
  return {
    function: handlerPath,
    authorizationType: sst.ApiAuthorizationType.NONE,
  };
}

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

    const topicAreaOnInsert = new sst.Topic(this, 'areaOnInsert', {
      subscribers: [new sst.Function(this, 'areaOnInsertHandler', {
        handler: 'src/events/area/areaOnInsert.handler',
        environment: {
          ALGOLIA_APP_ID: `${process.env.ALGOLIA_APP_ID}`, 
          ALGOLIA_ADMIN_KEY: `${process.env.ALGOLIA_ADMIN_KEY}`,
          ALGOLIA_INDEX: `${process.env.ALGOLIA_INDEX}`,
          tableName: table.dynamodbTable.tableName,
        },
        permissions: [table]
      })]
    });

    const topicAreaOnModify = new sst.Topic(this, 'areaOnModify', {
      subscribers: [new sst.Function(this, 'areaOnModifyHandler', {
        handler: 'src/events/area/areaOnModify.handler',
        environment: {
          ALGOLIA_APP_ID: `${process.env.ALGOLIA_APP_ID}`, 
          ALGOLIA_ADMIN_KEY: `${process.env.ALGOLIA_ADMIN_KEY}`,
          ALGOLIA_INDEX: `${process.env.ALGOLIA_INDEX}`,
          tableName: table.dynamodbTable.tableName,
        },
        permissions: [table]
      })]
    });

    const topicAreaOnRemove = new sst.Topic(this, 'areaOnRemove', {
      subscribers: [new sst.Function(this, 'areaOnRemoveHandler', {
        handler: 'src/events/area/areaOnRemove.handler',
        environment: {
          ALGOLIA_APP_ID: `${process.env.ALGOLIA_APP_ID}`, 
          ALGOLIA_ADMIN_KEY: `${process.env.ALGOLIA_ADMIN_KEY}`,
          ALGOLIA_INDEX: `${process.env.ALGOLIA_INDEX}`,
          tableName: table.dynamodbTable.tableName,
        },
        permissions: [table]
      })]
    });

    const topicCragOnInsert = new sst.Topic(this, 'cragOnInsert', {
      subscribers: [new sst.Function(this, 'cragOnInsertHandler', {
        handler: 'src/events/crag/cragOnInsert.handler',
        environment: {
          ALGOLIA_APP_ID: `${process.env.ALGOLIA_APP_ID}`, 
          ALGOLIA_ADMIN_KEY: `${process.env.ALGOLIA_ADMIN_KEY}`,
          ALGOLIA_INDEX: `${process.env.ALGOLIA_INDEX}`,
          tableName: table.dynamodbTable.tableName,
        },
        permissions: [table]
      })]
    });

    const topicCragOnModify = new sst.Topic(this, 'cragOnModify', {
      subscribers: [new sst.Function(this, 'cragOnModifyHandler', {
        handler: 'src/events/crag/cragOnModify.handler',
        environment: {
          ALGOLIA_APP_ID: `${process.env.ALGOLIA_APP_ID}`, 
          ALGOLIA_ADMIN_KEY: `${process.env.ALGOLIA_ADMIN_KEY}`,
          ALGOLIA_INDEX: `${process.env.ALGOLIA_INDEX}`,
          tableName: table.dynamodbTable.tableName,
        },
        permissions: [table]
      })]
    });

    const topicCragOnRemove = new sst.Topic(this, 'cragOnRemove', {
      subscribers: [new sst.Function(this, 'cragOnRemoveHandler', {
        handler: 'src/events/crag/cragOnRemove.handler',
        environment: {
          ALGOLIA_APP_ID: `${process.env.ALGOLIA_APP_ID}`, 
          ALGOLIA_ADMIN_KEY: `${process.env.ALGOLIA_ADMIN_KEY}`,
          ALGOLIA_INDEX: `${process.env.ALGOLIA_INDEX}`,
          tableName: table.dynamodbTable.tableName,
        },
        permissions: [table]
      })]
    });

    const topicLogOnInsert = new sst.Topic(this, 'logOnInsert', {
      subscribers: [new sst.Function(this, 'logOnInsertHandler', {
        handler: 'src/events/log/logOnInsert.handler',
        environment: {
          ALGOLIA_APP_ID: `${process.env.ALGOLIA_APP_ID}`, 
          ALGOLIA_ADMIN_KEY: `${process.env.ALGOLIA_ADMIN_KEY}`,
          ALGOLIA_INDEX: `${process.env.ALGOLIA_INDEX}`,
          tableName: table.dynamodbTable.tableName,
        },
        permissions: [table]
      })]
    });

    const topicLogOnRemove = new sst.Topic(this, 'logOnRemove', {
      subscribers: [new sst.Function(this, 'logOnRemoveHandler', {
        handler: 'src/events/log/logOnRemove.handler',
        environment: {
          ALGOLIA_APP_ID: `${process.env.ALGOLIA_APP_ID}`, 
          ALGOLIA_ADMIN_KEY: `${process.env.ALGOLIA_ADMIN_KEY}`,
          ALGOLIA_INDEX: `${process.env.ALGOLIA_INDEX}`,
          tableName: table.dynamodbTable.tableName,
        },
        permissions: [table]
      })]
    });

    const topicRouteOnInsert = new sst.Topic(this, 'routeOnInsert', {
      subscribers: [new sst.Function(this, 'routeOnInsertHandler', {
        handler: 'src/events/route/routeOnInsert.handler',
        environment: {
          ALGOLIA_APP_ID: `${process.env.ALGOLIA_APP_ID}`, 
          ALGOLIA_ADMIN_KEY: `${process.env.ALGOLIA_ADMIN_KEY}`,
          ALGOLIA_INDEX: `${process.env.ALGOLIA_INDEX}`,
          tableName: table.dynamodbTable.tableName,
        },
        permissions: [table]
      })]
    });

    const topicRouteOnModify = new sst.Topic(this, 'routeOnModify', {
      subscribers: [new sst.Function(this, 'routeOnModifyHandler', {
        handler: 'src/events/route/routeOnModify.handler',
        environment: {
          ALGOLIA_APP_ID: `${process.env.ALGOLIA_APP_ID}`, 
          ALGOLIA_ADMIN_KEY: `${process.env.ALGOLIA_ADMIN_KEY}`,
          ALGOLIA_INDEX: `${process.env.ALGOLIA_INDEX}`,
          tableName: table.dynamodbTable.tableName,
        },
        permissions: [table]
      })]
    });

    const topicRouteOnRemove = new sst.Topic(this, 'routeOnRemove', {
      subscribers: [new sst.Function(this, 'routeOnRemoveHandler', {
        handler: 'src/events/route/routeOnRemove.handler',
        environment: {
          ALGOLIA_APP_ID: `${process.env.ALGOLIA_APP_ID}`, 
          ALGOLIA_ADMIN_KEY: `${process.env.ALGOLIA_ADMIN_KEY}`,
          ALGOLIA_INDEX: `${process.env.ALGOLIA_INDEX}`,
          tableName: table.dynamodbTable.tableName,
        },
        permissions: [table]
      })]
    });

    const dynamoConsumer = new sst.Function(this, "climbing-topos-dynamodb-stream-consumer", {
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
      ]
    });

    table.addConsumer(this, dynamoConsumer);

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
      defaultAuthorizer: new apigAuthorizers.HttpJwtAuthorizer({
        jwtAudience: ["https://climbingtopos.com"],
        jwtIssuer: `${process.env.AUTH0_DOMAIN}`,
      }),
      defaultAuthorizationType: sst.ApiAuthorizationType.JWT,
      defaultFunctionProps: {
        environment: {
          tableName: table.dynamodbTable.tableName,
          imageBucketName: imagesBucket.s3Bucket.bucketName,
          AUTH0_DOMAIN: `${process.env.AUTH0_DOMAIN}`,
        },
      },
      routes: {
        "POST /areas": "src/routes/areas/post.handler",
        "GET /areas/{areaSlug}": publicFunction("src/routes/areas/get.handler"),
        "GET /crags": publicFunction("src/routes/crags/get.handler"),
        "POST /crags": "src/routes/crags/post.handler",
        "GET /crags/{slug}": publicFunction("src/routes/crags/get.handler"),
        "GET /lists": "src/routes/lists/get.handler",
        "POST /lists": "src/routes/lists/post.handler",
        "PATCH /lists": "src/routes/lists/patch.handler",
        "GET /lists/{listSlug}": "src/routes/lists/get.handler",
        "POST /logs": "src/routes/logs/post.handler",
        "GET /profile/logs": "src/routes/profile/logs/get.handler",
        "GET /routes": publicFunction("src/routes/routes/get.handler"),
        "POST /routes": "src/routes/routes/post.handler",
        "POST /topos": "src/routes/topos/post.handler",
        "GET /topos/{topoSlug}": publicFunction("src/routes/topos/get.handler"),
        "GET /pre-signed-upload-url":
          "src/routes/upload/pre-signed-upload-url/get.handler",
      },
    });

    api.attachPermissions([imagesBucket, table]);

    this.addOutputs({
      ApiEndpoint: api.url,
    });
  }
}
