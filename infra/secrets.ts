export const algoliaAdminKey = new sst.Secret(
  'AlgoliaAdminKey',
  process.env.ALGOLIA_ADMIN_KEY,
);

export const algoliaAppId = new sst.Secret(
  'AlgoliaAppId',
  process.env.ALGOLIA_APP_ID,
);

export const algoliaIndex = new sst.Secret(
  'AlgoliaIndex',
  process.env.ALGOLIA_INDEX,
);

export const algoliaSearchApiKey = new sst.Secret(
  'AlgoliaSearchApiKey',
  process.env.ALGOLIA_SEARCH_API_KEY,
);

export const postHogKey = new sst.Secret('PostHogKey', process.env.POSTHOG_KEY);

export const postHogHost = new sst.Secret(
  'PostHogHost',
  process.env.POSTHOG_HOST,
);

export const jwtPrivateKey = new sst.Secret(
  'JwtPrivateKey',
  process.env.JWT_PRIVATE_KEY,
);

export const jwtPublicKey = new sst.Secret(
  'JwtPublicKey',
  process.env.JWT_PUBLIC_KEY,
);

export const sentryDsn = new sst.Secret('SentryDsn', process.env.SENTRY_DSN);

export const sentryAuthToken = new sst.Secret(
  'SentryAuthToken',
  process.env.SENTRY_AUTH_TOKEN,
);
