import { Crag } from "core/types";
import React from "react";
import { Link } from "react-router-dom";

function SearchResultCrag({ crag }: { crag: Crag }) {
  return (
    <Link className="box" to={`/crags/${crag.slug}`}>
      <article className="media">
        <div className="media-content">
          <div className="content">
            <p>
              <span className="tag is-pulled-right">Crag</span>
              <b>{ crag.title } </b>
              <br />
              <small>{ crag.osmData.address.county }, { crag.osmData.address.country }</small>
            </p>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default SearchResultCrag;
