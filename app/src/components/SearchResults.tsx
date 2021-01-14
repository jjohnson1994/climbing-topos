import { connectHits } from 'react-instantsearch-dom';
import SearchResultCrag from "../components/SearchResultCrag";
import SearchResultArea from "../components/SearchResultArea";
import SearchResultRoute from "../components/SearchResultRoute";

const Hits = ({ hits }: { hits: any }) => (
  <>
    {hits.map((hit: any) => (
      <>
        { hit.model === "crag" && (
          <SearchResultCrag key={ hit.objectID } crag={ hit } />
        )}
        { hit.model === "area" && (
          <SearchResultArea key={ hit.objectID } area={ hit } />
        )}
        { hit.model === "route" && (
          <SearchResultRoute key={ hit.objectID } route={ hit } />
        )}
      </>
    ))}
  </>
);

export default connectHits(Hits);
