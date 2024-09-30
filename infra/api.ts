import { table } from './dynamo'
import { bucket } from './storage'
import { userPool, userPoolClient } from './auth'

const cognito = new sst.Linkable("Cognito", {
  properties: {
    userPoolClientId: userPoolClient.id,
    userPoolId: userPool.id
  },
  include: [
    sst.aws.permission({
      actions: ["cognito-idp:*"],
      resources: ['*']
    })
  ]
});

const api = new sst.aws.ApiGatewayV2("climbingtopos2-api", {
  transform: {
    route: {
      handler: {
        link: [table, cognito, bucket],
      },
      args: {
        auth: { iam: true }
      },
    },
  }
});

api.route("POST /areas", {
  handler: "packages/api/routes/areas/post.handler",
});

api.route("GET /areas/{areaSlug}", {
  handler: "packages/api/routes/areas/get.handler",
});

api.route("PATCH /areas/{areaSlug}", "packages/api/routes/areas/patch.handler", {
  auth: { iam: true}
});

api.route("GET /crags", "packages/api/routes/crags/get.handler");

api.route("POST /crags", "packages/api/routes/crags/post.handler", {
  auth: { iam: true}
});

api.route("GET /crags/{cragSlug}", "packages/api/routes/crags/get.handler");

api.route("PATCH /crags/{cragSlug}", "packages/api/routes/crags/patch.handler", {
  auth: { iam: true}
});

api.route("GET /crags/{slug}/items-awaiting-approval", "packages/api/routes/crags/items-awaiting-approval/get.handler", {
  auth: { iam: true}
}),

api.route("GET /lists", "packages/api/routes/lists/get.handler", {
  auth: { iam: true}
});

api.route("PATCH /lists", "packages/api/routes/lists/patch.handler", {
  auth: { iam: true}
});

api.route("POST /lists", "packages/api/routes/lists/post.handler", {
  auth: { iam: true}
});

api.route("GET /lists/{listSlug}", "packages/api/routes/lists/get.handler", {
  auth: { iam: true }
})

api.route("POST /logs", "packages/api/routes/logs/post.handler", {
  auth: { iam: true }
})

api.route("GET /pre-signed-upload-url", {
  handler: "packages/api/routes/upload/pre-signed-upload-url/get.handler",
  link: [bucket]
})

api.route("GET /profile/logs", "packages/api/routes/profile/logs/get.handler", {
  auth: { iam: true }
});

api.route("GET /routes", "packages/api/routes/routes/get.handler");

api.route("POST /routes", "packages/api/routes/routes/post.handler", {
  auth: { iam: true }
});

api.route("PATCH /routes/{routeSlug}", "packages/api/routes/routes/patch.handler", {
  auth: { iam: true}
}),

api.route("GET /routes/logs", "packages/api/routes/routes/logs/get.handler");

api.route("POST /topos", "packages/api/routes/topos/post.handler", {
  auth: { iam: true }
});

api.route("GET /topos/{topoSlug}", "packages/api/routes/topos/get.handler");

api.route("PATCH /topos/{topoSlug}", "packages/api/routes/topos/patch.handler", {
  auth: { iam: true }
});

export { api }
