import { createFileRoute } from '@tanstack/react-router'
import '@/styles/search.scss'
import { liteClient as algoliasearch } from 'algoliasearch/lite'
import { Hits, SearchBox, InstantSearch } from 'react-instantsearch'
import SearchResults from '@/components/SearchResults'

const searchClient = algoliasearch(
  `${import.meta.env.VITE_ALGOLIA_APP_ID}`,
  `${import.meta.env.VITE_ALGOLIA_SEARCH_API_KEY}`,
)

const algoliaIndexName = `${import.meta.env.VITE_ALGOLIA_INDEX}`

export const Route = createFileRoute('/search')({
  component: SearchPage,
})

function SearchPage() {
  return (
    <InstantSearch searchClient={searchClient as any} indexName={algoliaIndexName}>
      <section className="section pb-0">
        <div className="container">
          <h1 className="title">Search</h1>
          <div className="field is-grouped">
            <div className="control is-expanded has-icons-left">
              <span className="icon is-icon-left">
                <i className="fas fa-search" aria-hidden="true"></i>
              </span>
              <SearchBox
                classNames={{
                  input: 'input is-rounded',
                  submit: 'is-hidden',
                  reset: 'is-hidden',
                }}
              />
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <Hits hitComponent={SearchResults} classNames={{ item: 'py-3' }} />
        </div>
      </section>
    </InstantSearch>
  )
}
