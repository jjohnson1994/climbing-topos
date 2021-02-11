import { Route } from "core/types";
import React from "react";
import { Link } from "react-router-dom";

function SearchResultsRoute({ route }: { route: Route }) {
  return (
    <Link className="box" to={`/crags/${route.cragSlug}/areas/${route.areaSlug}/routes/${route.slug}`}>
      <article className="media">
        <div className="media-content">
          <div className="content">
            <p>
              <span className="tag is-pulled-right">Route</span>
              <b>{ route.title } </b> { route.cragTitle }
              <br />
              <small>{ route.gradeIndex } { route.routeTypeId }</small>
            </p>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default SearchResultsRoute;
