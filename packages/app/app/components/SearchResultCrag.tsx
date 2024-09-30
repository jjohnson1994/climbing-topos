import { Crag } from "core/types";
import { Link } from "react-router-dom";

function SearchResultCrag({ crag }: { crag: Crag }) {
  return (
    <Link to={`/crags/${crag.slug}`} className="box p-0" style={{ overflow: 'hidden' }}>
      <div className="columns is-mobile is-gapless">
        <div className="column is-narrow">
          <img 
            src={ `${crag.image}` } 
            alt={ crag.title } 
            className="image is-128x128" 
            style={{
              objectFit: 'cover',
              height: '100%',
            }}
          />
        </div>
        <div className="column m-3">
          <p>
            <span className="tag is-pulled-right">Crag</span>
            <b>{ crag.title } </b>
            <br />
            <small>{ crag.osmData.address.county }, { crag.osmData.address.country }</small>
          </p>
        </div>
      </div>
    </Link>
  )
}

export default SearchResultCrag;
