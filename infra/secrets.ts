export const algoliaAdminKey = new sst.Secret("AlgoliaAdminKey", process.env.ALGOLIA_ADMIN_KEY);
export const algoliaAppId = new sst.Secret("AlgoliaAppId", process.env.ALGOLIA_APP_ID);
export const algoliaIndex = new sst.Secret("AlgoliaIndex", process.env.ALGOLIA_INDEX);

