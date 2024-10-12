import { Resource } from 'sst';

import algoliasearch, { SearchIndex } from 'algoliasearch';

const client = algoliasearch(
  `${Resource.AlgoliaAppId.value}`,
  `${Resource.AlgoliaAdminKey.value}`,
);
const index = client.initIndex(`${Resource.AlgoliaIndex.value}`);

export const algolaIndex: SearchIndex = index;
export default index;
