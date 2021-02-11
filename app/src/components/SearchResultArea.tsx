import { Area } from "core/types";
import React from "react";
import { Link } from "react-router-dom";

function SearchResultCrag({ area }: { area: Area }) {
  return (
    <Link className="box" to={`/crags/${area.cragSlug}/areas/${area.slug}`}>
      <article className="media">
        <div className="media-content">
          <div className="content">
            <p>
              <span className="tag is-pulled-right">Area</span>
              <b>{ area.title } </b>
              <span>{ area.cragTitle }</span>
              <br />
              <small>{ area.osmData.address.county }, { area.osmData.address.country }</small>
            </p>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default SearchResultCrag;
