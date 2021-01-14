import { connectHits } from 'react-instantsearch-dom';

const Hits = ({ hits }: { hits: any }) => (
  <>
    {hits.map((hit: any) => (
      <div key={ hit.objectID } className="box">
        { JSON.stringify(hit) }
      </div>
    ))}
  </>
);

export default connectHits(Hits);
