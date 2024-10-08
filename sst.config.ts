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

    await import("./infra/storage");
    const { api } = await import("./infra/api");
    const { userPool, identityPool, userPoolClient } = await import("./infra/auth");
    const { algoliaAppId, algoliaIndex, algoliaAdminKey, algoliaSearchApiKey } = await import('./infra/secrets')
    await import("./infra/sns")

    return new sst.aws.Nextjs("climbingtopos2-frontend", {
      path: "packages/app/",
      environment: {
        NEXT_PUBLIC_API_URL: api.url,
        NEXT_PUBLIC_REGION: region,
        NEXT_PUBLIC_USER_POOL_ID: userPool.id,
        NEXT_PUBLIC_IDENTITY_POOL_ID: identityPool.id,
        NEXT_PUBLIC_USER_POOL_CLIENT_ID: userPoolClient.id,
        NEXT_PUBLIC_ALGOLIA_APP_ID: algoliaAppId.value,
        NEXT_PUBLIC_ALGOLIA_INDEX: algoliaIndex.value,
        NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY: algoliaSearchApiKey.value,
      },
      dev: {
        autostart: true
      }
    });
  },
});
