import { Route } from "core/types";
import { Link } from "react-router-dom";
import { useGradeHelpers } from "../api/grades";

function SearchResultsRoute({ route }: { route: Route }) {
  const { convertGradeValueToGradeLabel } = useGradeHelpers();

  return (
    <Link className="box p-0" to={`/crags/${route.cragSlug}/areas/${route.areaSlug}/routes/${route.slug}`} style={{ overflow: "hidden" }}>
      <div className="columns is-mobile is-gapless">
        <div className="column is-narrow">
          <img 
            src={ `${route.drawing.backgroundImage}` } 
            alt={ route.title } 
            className="image is-128x128" 
            style={{
              objectFit: 'cover',
              height: '100%',
            }}
          />
        </div>
        <div className="column m-3">
          <p>
            <span className="tag is-pulled-right">Route</span>
            <b>{ route.title } </b> { route.cragTitle }
            <br />
            <small>{ route.gradingSystem } { convertGradeValueToGradeLabel(route.gradeModal, route.gradingSystem) }</small>
          </p>
        </div>
      </div>
    </Link>
  )
}

export default SearchResultsRoute;
