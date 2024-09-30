/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "climbingtopos2",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    const region = aws.getRegionOutput().name;

    const storage = await import("./infra/storage");
    const { api } = await import("./infra/api");
    const { userPool, identityPool, userPoolClient } = await import("./infra/auth");
    await import("./infra/sns")

    return new sst.aws.Nextjs("climbingtopos2-frontend", {
      path: "packages/app/",
      link: [storage],
      environment: {
        NEXT_PUBLIC_API_URL: api.url,
        NEXT_PUBLIC_REGION: region,
        NEXT_PUBLIC_USER_POOL_ID: userPool.id,
        NEXT_PUBLIC_IDENTITY_POOL_ID: identityPool.id,
        NEXT_PUBLIC_USER_POOL_CLIENT_ID: userPoolClient.id,
      },
      dev: {
        autostart: true
      }
    });
  },
});
