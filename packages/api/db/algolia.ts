import { Resource } from "sst";

import algoliasearch, { SearchIndex } from "algoliasearch";

console.log('alogolia')
console.log('alogolia')
console.log('alogolia')
console.log('alogolia')
console.log('alogolia')
console.log('alogolia')
console.log('alogolia')
console.log('alogolia')
console.log('alogolia')
console.log('alogolia')
console.log({ appId: Resource.AlgoliaAppId.value, apiKey: Resource.AlgoliaAdminKey.value, index: Resource.AlgoliaIndex.value})
const client = algoliasearch(`${Resource.AlgoliaAppId.value}`, `${Resource.AlgoliaAdminKey.value}`);
const index = client.initIndex(`${Resource.AlgoliaIndex.value}`);

export const algolaIndex: SearchIndex = index;
export default index;
