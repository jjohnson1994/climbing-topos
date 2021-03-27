import { Route } from "core/types";
import { Link } from "react-router-dom";
import { useUserPreferences } from "../api/profile";

function SearchResultsRoute({ route }: { route: Route }) {
  const { convertGradeToUserPreference } = useUserPreferences();

  return (
    <Link className="box" to={`/crags/${route.cragSlug}/areas/${route.areaSlug}/routes/${route.slug}`}>
      <article className="media">
        <div className="media-content">
          <div className="content">
            <p>
              <span className="tag is-pulled-right">Route</span>
              <b>{ route.title } </b> { route.cragTitle }
              <br />
              <small>{ convertGradeToUserPreference(route.gradeModal, route.routeType) }</small>
            </p>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default SearchResultsRoute;
