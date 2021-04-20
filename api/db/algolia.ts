import algoliasearch, { SearchIndex } from "algoliasearch";

const client = algoliasearch(`${process.env.ALGOLIA_APP_ID}`, `${process.env.ALGOLIA_ADMIN_KEY}`);
const index = client.initIndex(`${process.env.ALGOLIA_INDEX}`);

export const algolaIndex: SearchIndex = index;
export default index;
