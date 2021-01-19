import { connectHits } from 'react-instantsearch-dom';
import SearchResultCrag from "../components/SearchResultCrag";
import SearchResultArea from "../components/SearchResultArea";
import SearchResultRoute from "../components/SearchResultRoute";

const Hits = ({ hits }: { hits: any }) => (
  <>
    { hits.map((hit: any) => {
      if (hit.model === "crag") {
        return <SearchResultCrag key={ hit.objectID } crag={ hit } />
      } else if (hit.model === "area") {
        return <SearchResultArea key={ hit.objectID } area={ hit } />
      } else if (hit.model === "route") {
        return <SearchResultRoute key={ hit.objectID } route={ hit } />
      } else {
        return "";
      }
    })}
  </>
);

export default connectHits(Hits);
