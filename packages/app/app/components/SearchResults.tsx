import SearchResultCrag from "@/app/components/SearchResultCrag";
import SearchResultArea from "@/app/components/SearchResultArea";
import SearchResultRoute from "@/app/components/SearchResultRoute";

const Hits = ({ hit }: { hit: any }) => (
  <>
    { 
      hit.model === "crag"  &&
        <SearchResultCrag key={ hit.objectID } crag={ hit } />
    }

    { hit.model === "area" &&
        <SearchResultArea key={ hit.objectID } area={ hit } />
    } 

    { hit.model === "route" &&
        <SearchResultRoute key={ hit.objectID } route={ hit } />
    } 
  </>
);

export default Hits;
