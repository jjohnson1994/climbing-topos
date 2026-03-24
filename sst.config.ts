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
    const { bucket, imagesCdn } = await import('./infra/storage');
    const {
      algoliaAppId,
      algoliaIndex,
      algoliaSearchApiKey,
      postHogHost,
      postHogKey,
      jwtPrivateKey,
      jwtPublicKey,
      sentryDsn,
      sentryAuthToken,
    } = await import('./infra/secrets');
    await import('./infra/sns');

    const app = new sst.aws.TanStackStart('climbingtopos2-app', {
      path: 'packages/app/',
      domain: {
        name: 'climbingtopos.com',
        dns: false,
        cert: 'arn:aws:acm:us-east-1:085474378228:certificate/c8a5b94e-63de-4984-a5a1-5f187430d735',
      },
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
        VITE_ALGOLIA_APP_ID: algoliaAppId.value,
        VITE_ALGOLIA_INDEX: algoliaIndex.value,
        VITE_ALGOLIA_SEARCH_API_KEY: algoliaSearchApiKey.value,
        VITE_POSTHOG_KEY: postHogKey.value,
        VITE_POSTHOG_HOST: postHogHost.value,
        IMAGES_CDN_URL: imagesCdn.url,
        VITE_SENTRY_DSN: sentryDsn.value,
        SENTRY_AUTH_TOKEN: sentryAuthToken.value,
      },
      transform: {
        cdn: (cdnArgs) => {
          cdnArgs.customErrorResponses = [
            { errorCode: 500, errorCachingMinTtl: 0 },
            { errorCode: 502, errorCachingMinTtl: 0 },
            { errorCode: 503, errorCachingMinTtl: 0 },
            { errorCode: 504, errorCachingMinTtl: 0 },
          ];
        },
      },
      dev: {
        autostart: true,
        url: 'http://localhost:3000',
      },
    });

    if ($dev) {
      const admin = new sst.aws.Nextjs('climbingtopos2-admin', {
        path: 'packages/admin/',
        link: [table, bucket],
        environment: {
          IMAGES_CDN_URL: imagesCdn.url,
        },
        dev: {
          url: 'http://localhost:3001',
          autostart: true,
        },
      });
      return { app, admin, table, bucket };
    }

    return { app, appUrl: app.url };
  },
});
