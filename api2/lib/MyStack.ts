import * as iam from "aws-cdk-lib/aws-iam";
import * as sst from "@serverless-stack/resources";
// import { CorsHttpMethod } from "aws-cdk-lib/aws-apigatewayv2";
import { BucketAccessControl, HttpMethods } from "aws-cdk-lib/aws-s3";

export default class MyStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    const imagesBucket = new sst.Bucket(
      this,
      `climbing-topos-images-${process.env.NODE_ENV}`,
      {
        // TODO
        cdk: {
          bucket: {
            accessControl: BucketAccessControl.PUBLIC_READ
          }
        },
        cors: [
          {
            allowedHeaders: ["*"],
            allowedMethods: [HttpMethods.PUT],
            allowedOrigins: [
              "http://localhost:3000",
              "https://climbingtopos.com",
            ],
            maxAge: '30 seconds',
          },
        ],
      }
    );

    const table = new sst.Table(this, "climbing-topos-2", {
      fields: {
        hk: 'string',
        sk: 'string',
        model: 'string',
        slug: 'string',
      },
      primaryIndex: { partitionKey: "hk", sortKey: "sk" },
      globalIndexes: {
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
      subscribers: {
        subscriber: {
          function: {
            srcPath: 'src/events/area/',
            handler: "areaOnInsert.handler",
            environment: {
              ALGOLIA_APP_ID: `${process.env.ALGOLIA_APP_ID}`,
              ALGOLIA_ADMIN_KEY: `${process.env.ALGOLIA_ADMIN_KEY}`,
              ALGOLIA_INDEX: `${process.env.ALGOLIA_INDEX}`,
              tableName: table.tableName,
            },
            permissions: [table],
          }
        }
      },
    });

    const topicAreaOnModify = new sst.Topic(this, "areaOnModify", {
      subscribers: {
        subscriber: {
          function: {
            srcPath: "src/events/area/",
            handler: "areaOnModify.handler",
            environment: {
              ALGOLIA_APP_ID: `${process.env.ALGOLIA_APP_ID}`,
              ALGOLIA_ADMIN_KEY: `${process.env.ALGOLIA_ADMIN_KEY}`,
              ALGOLIA_INDEX: `${process.env.ALGOLIA_INDEX}`,
              tableName: table.tableName,
            },
            permissions: [table],
          }
        }
      }
    })

    const topicAreaOnRemove = new sst.Topic(this, "areaOnRemove", {
      subscribers: {
        subscriber: {
          function: {
            srcPath: "src/events/area/",
            handler: "areaOnRemove.handler",
            environment: {
              ALGOLIA_APP_ID: `${process.env.ALGOLIA_APP_ID}`,
              ALGOLIA_ADMIN_KEY: `${process.env.ALGOLIA_ADMIN_KEY}`,
              ALGOLIA_INDEX: `${process.env.ALGOLIA_INDEX}`,
              tableName: table.tableName,
            },
            permissions: [table],
          }
        }
      }
    })

    const topicCragOnInsert = new sst.Topic(this, "cragOnInsert", {
      subscribers: {
        subscriber: {
          function: {
            srcPath: "src/events/crag/",
            handler: "cragOnInsert.handler",
            environment: {
              ALGOLIA_APP_ID: `${process.env.ALGOLIA_APP_ID}`,
              ALGOLIA_ADMIN_KEY: `${process.env.ALGOLIA_ADMIN_KEY}`,
              ALGOLIA_INDEX: `${process.env.ALGOLIA_INDEX}`,
              tableName: table.tableName,
            },
            permissions: [table],

          }
        }
      }
    });

    const topicCragOnModify = new sst.Topic(this, "cragOnModify", {
      subscribers: {
        subscriber: {
          function: {
            handler: "src/events/crag/cragOnModify.handler",
            environment: {
              ALGOLIA_APP_ID: `${process.env.ALGOLIA_APP_ID}`,
              ALGOLIA_ADMIN_KEY: `${process.env.ALGOLIA_ADMIN_KEY}`,
              ALGOLIA_INDEX: `${process.env.ALGOLIA_INDEX}`,
              tableName: table.tableName,
            },
            permissions: [table],
          }
        }
      }
    })

    const topicCragOnRemove = new sst.Topic(this, "cragOnRemove", {
      subscribers: {
        subscriber: {
          function: {
            handler: "src/events/crag/cragOnRemove.handler",
            environment: {
              ALGOLIA_APP_ID: `${process.env.ALGOLIA_APP_ID}`,
              ALGOLIA_ADMIN_KEY: `${process.env.ALGOLIA_ADMIN_KEY}`,
              ALGOLIA_INDEX: `${process.env.ALGOLIA_INDEX}`,
              tableName: table.tableName,
            },
            permissions: [table],
          }
        }
      }
    });

    const topicLogOnInsert = new sst.Topic(this, "logOnInsert", {
      subscribers: {
        subscriber: {
          function: {
            handler: "src/events/log/logOnInsert.handler",
            environment: {
              ALGOLIA_APP_ID: `${process.env.ALGOLIA_APP_ID}`,
              ALGOLIA_ADMIN_KEY: `${process.env.ALGOLIA_ADMIN_KEY}`,
              ALGOLIA_INDEX: `${process.env.ALGOLIA_INDEX}`,
              tableName: table.tableName,
            },
            permissions: [table],

          }
        }
      }
    });

    const topicLogOnRemove = new sst.Topic(this, "logOnRemove", {
      subscribers: {
        subscriber: {
          function: {
            handler: "src/events/log/logOnRemove.handler",
            environment: {
              ALGOLIA_APP_ID: `${process.env.ALGOLIA_APP_ID}`,
              ALGOLIA_ADMIN_KEY: `${process.env.ALGOLIA_ADMIN_KEY}`,
              ALGOLIA_INDEX: `${process.env.ALGOLIA_INDEX}`,
              tableName: table.tableName,
            },
            permissions: [table],
          }
        }
      }
    });

    const topicRouteOnInsert = new sst.Topic(this, "routeOnInsert", {
      subscribers: {
        subscriber: {
          function: {
            handler: "src/events/route/routeOnInsert.handler",
            environment: {
              ALGOLIA_APP_ID: `${process.env.ALGOLIA_APP_ID}`,
              ALGOLIA_ADMIN_KEY: `${process.env.ALGOLIA_ADMIN_KEY}`,
              ALGOLIA_INDEX: `${process.env.ALGOLIA_INDEX}`,
              tableName: table.tableName,
            },
            permissions: [table],
          }
        }
      },
    });

    const topicRouteOnModify = new sst.Topic(this, "routeOnModify", {
      subscribers: {
        subscriber: {
          function: {
            handler: "src/events/route/routeOnModify.handler",
            environment: {
              ALGOLIA_APP_ID: `${process.env.ALGOLIA_APP_ID}`,
              ALGOLIA_ADMIN_KEY: `${process.env.ALGOLIA_ADMIN_KEY}`,
              ALGOLIA_INDEX: `${process.env.ALGOLIA_INDEX}`,
              tableName: table.tableName,
            },
            permissions: [table],
          }
        }
      }
    })

    const topicRouteOnRemove = new sst.Topic(this, "routeOnRemove", {
      subscribers: {
        subscriber: {
          function: {
            handler: "src/events/route/routeOnRemove.handler",
            environment: {
              ALGOLIA_APP_ID: `${process.env.ALGOLIA_APP_ID}`,
              ALGOLIA_ADMIN_KEY: `${process.env.ALGOLIA_ADMIN_KEY}`,
              ALGOLIA_INDEX: `${process.env.ALGOLIA_INDEX}`,
              tableName: table.tableName,
            },
            permissions: [table],

          }
        }
      }
    });

    const topicTopoOnInsert = new sst.Topic(this, "topoOnInsert", {
      subscribers: {
        subscriber: {
          function: {
            handler: "src/events/topo/topoOnInsert.handler",
            environment: {
              ALGOLIA_APP_ID: `${process.env.ALGOLIA_APP_ID}`,
              ALGOLIA_ADMIN_KEY: `${process.env.ALGOLIA_ADMIN_KEY}`,
              ALGOLIA_INDEX: `${process.env.ALGOLIA_INDEX}`,
              tableName: table.tableName,
            },
            permissions: [table],
          }
        }
      },
    });

    const topicTopoOnModify = new sst.Topic(this, "topoOnModify", {
      subscribers: {
        subscriber: {
          function: {
            handler: "src/events/topo/topoOnModify.handler",
            environment: {
              ALGOLIA_APP_ID: `${process.env.ALGOLIA_APP_ID}`,
              ALGOLIA_ADMIN_KEY: `${process.env.ALGOLIA_ADMIN_KEY}`,
              ALGOLIA_INDEX: `${process.env.ALGOLIA_INDEX}`,
              tableName: table.tableName,
            },
            permissions: [table],
          }
        }
      },
    });

    const topicTopoOnRemove = new sst.Topic(this, "topoOnRemove", {
      subscribers: {
        subscriber: {
          function: {
            handler: "src/events/topo/topoOnRemove.handler",
            environment: {
              ALGOLIA_APP_ID: `${process.env.ALGOLIA_APP_ID}`,
              ALGOLIA_ADMIN_KEY: `${process.env.ALGOLIA_ADMIN_KEY}`,
              ALGOLIA_INDEX: `${process.env.ALGOLIA_INDEX}`,
              tableName: table.tableName,
            },
            permissions: [table],
          }
        }
      },
    });

    const dynamoConsumer = new sst.Function(
      this,
      "climbing-topos-dynamodb-stream-consumer-2",
      {
        handler: "src/events/dynamodb/stream.handler",
        environment: {
          TOPIC_ARN_AREA_INSERT: topicAreaOnInsert.topicArn,
          TOPIC_ARN_AREA_MODIFY: topicAreaOnModify.topicArn,
          TOPIC_ARN_AREA_REMOVE: topicAreaOnRemove.topicArn,
          TOPIC_ARN_CRAG_INSERT: topicCragOnInsert.topicArn,
          TOPIC_ARN_CRAG_MODIFY: topicCragOnModify.topicArn,
          TOPIC_ARN_CRAG_REMOVE: topicCragOnRemove.topicArn,
          TOPIC_ARN_LOG_INSERT: topicLogOnInsert.topicArn,
          TOPIC_ARN_LOG_REMOVE: topicLogOnRemove.topicArn,
          TOPIC_ARN_ROUTE_INSERT: topicRouteOnInsert.topicArn,
          TOPIC_ARN_ROUTE_MODIFY: topicRouteOnModify.topicArn,
          TOPIC_ARN_ROUTE_REMOVE: topicRouteOnRemove.topicArn,
          TOPIC_ARN_TOPO_INSERT: topicTopoOnInsert.topicArn,
          TOPIC_ARN_TOPO_MODIFY: topicTopoOnModify.topicArn,
          TOPIC_ARN_TOPO_REMOVE: topicTopoOnRemove.topicArn,
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
        allowMethods: ['ANY'],
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
      defaults: {
        authorizer: "iam",
        function: {
          environment: {
            tableName: table.tableName,
            imageBucketName: imagesBucket.bucketName,
            AUTH0_DOMAIN: `${process.env.AUTH0_DOMAIN}`,
          },
        }
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

    const auth = new sst.Cognito(this, "climbing-topos-auth", {
      login: ["email"],
      cdk: {
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

    api.attachPermissions([imagesBucket, table, new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["cognito-idp:ListUsers"],
      resources: [auth.userPoolArn],
    })]);

    auth.attachPermissionsForAuthUsers(this, [
      api,
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["s3:PutObject", "s3:GetObject"],
        resources: [`${imagesBucket.bucketArn}/*`],
      })
    ]);

    auth.attachPermissionsForUnauthUsers(this, [
      api,
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["s3:GetObject"],
        resources: [`${imagesBucket.bucketArn}/*`],
      }),
    ]);

    this.addOutputs({
      ApiEndpoint: api.url,
      UserPoolId: auth.userPoolId,
      UserPoolClientId: auth.userPoolClientId,
      IdentityPoolId: `${auth.cognitoIdentityPoolId}`
    });
  }
}
