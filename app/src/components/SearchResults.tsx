import { connectHits } from 'react-instantsearch-dom';

const Hits = ({ hits }: { hits: any }) => (
  <>
    {hits.map((hit: any) => (
      <>
        { hit.model === "crag" && (
          <div key={ hit.objectID } className ="box">
            { JSON.stringify(hit) }
          </div>
        )}
        { hit.model === "area" && (
          <div key={ hit.objectID } className="box">
            { JSON.stringify(hit) }
          </div>
        )}
        { hit.model === "route" && (
          <div key={ hit.objectID } className="box">
            { JSON.stringify(hit) }
          </div>
        )}
      </>
    ))}
  </>
);

export default connectHits(Hits);
