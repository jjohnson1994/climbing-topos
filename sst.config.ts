/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'climbingtopos2',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'aws',
      providers: {
        aws: {
          region: 'eu-west-1',
        },
      },
    };
  },
  async run() {
    const { email } = await import('./infra/email');

    const { table } = await import('./infra/dynamo');
    const { bucket } = await import('./infra/storage');
    const {
      algoliaAppId,
      algoliaIndex,
      algoliaSearchApiKey,
      postHogHost,
      postHogKey,
      jwtPrivateKey,
      jwtPublicKey,
    } = await import('./infra/secrets');
    await import('./infra/sns');

    const app = new sst.aws.Nextjs('climbingtopos2-frontend', {
      path: 'packages/app/',
      link: [
        table,
        bucket,
        postHogKey,
        postHogHost,
        email,
        jwtPublicKey,
        jwtPrivateKey,
      ],
      environment: {
        NEXT_PUBLIC_ALGOLIA_APP_ID: algoliaAppId.value,
        NEXT_PUBLIC_ALGOLIA_INDEX: algoliaIndex.value,
        NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY: algoliaSearchApiKey.value,
        NEXT_PUBLIC_POSTHOG_KEY: postHogKey.value,
        NEXT_PUBLIC_POSTHOG_HOST: postHogHost.value,
      },
      dev: {
        autostart: true,
      },
    });

    return app;
  },
});
