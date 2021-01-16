import Tippy from '@tippyjs/react';
import SearchBox from "../../components/SearchBox";
import SearchResults from "../../components/SearchResults";

function Search() {
  return (
    <>
      <section className="section">
        <div className="container">
          <h1 className="title">Search</h1>
          <div className="field is-grouped">
            <div className="control is-expanded has-icons-left">
              <span className="icon is-icon-left">
                <i className="fas fa-search"></i>
              </span>
              <SearchBox />
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SearchResults />
        </div>
      </section>
    </>
  );
}

export default Search;
