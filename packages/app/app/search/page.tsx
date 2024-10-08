"use client"

import { liteClient as algoliasearch } from "algoliasearch/lite";
import { Hits, SearchBox, InstantSearch } from "react-instantsearch";

import SearchResults from "@/app/components/SearchResults";

import './styles.scss'

const searchClient = algoliasearch(
  `${process.env.NEXT_PUBLIC_ALGOLIA_APP_ID}`,
  `${process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY}`
);

const algoliaIndexName = `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX}`;

function Search() {
  return (
    <InstantSearch searchClient={searchClient} indexName={algoliaIndexName}>
      <section className="section pb-0">
        <div className="container">
          <h1 className="title">Search</h1>
          <div className="field is-grouped">
            <div className="control is-expanded has-icons-left">
              <span className="icon is-icon-left">
                <i className="fas fa-search"></i>
              </span>
              <SearchBox
                classNames={{
                  input: 'input is-rounded',
                  submit: 'is-hidden',
                  reset: 'is-hidden'
                }}
              />
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <Hits
            hitComponent={SearchResults}
            classNames={{ item: 'py-3' }}
          />
        </div>
      </section>
    </InstantSearch>
  );
}

export default Search;
