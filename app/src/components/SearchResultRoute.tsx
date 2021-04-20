import { Route } from "core/types";
import { Link } from "react-router-dom";
import { useGradeHelpers } from "../api/grades";

function SearchResultsRoute({ route }: { route: Route }) {
  const { convertGradeValueToGradeLabel } = useGradeHelpers();

  return (
    <Link className="box" to={`/crags/${route.cragSlug}/areas/${route.areaSlug}/routes/${route.slug}`}>
      <article className="media">
        <div className="media-content">
          <div className="content">
            <p>
              <span className="tag is-pulled-right">Route</span>
              <b>{ route.title } </b> { route.cragTitle }
              <br />
              <small>{ route.gradingSystem } { convertGradeValueToGradeLabel(route.gradeModal, route.gradingSystem) }</small>
            </p>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default SearchResultsRoute;
