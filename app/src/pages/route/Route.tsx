import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { routes } from "../../api";
import { RouteView } from "../../../../core/types";
import TopoImage from "../../components/TopoImage";

function RoutePage() {
  const { cragSlug, areaSlug, topoSlug, routeSlug } = useParams<{ cragSlug: string; areaSlug: string; topoSlug: string; routeSlug: string }>();
  const [route, setRoute] = useState<RouteView>();

  useEffect(() => {
    (async () => {
      try {
        const newRoute = await routes.getRoute(cragSlug, areaSlug, topoSlug, routeSlug);
        setRoute(newRoute);
      } catch (error) {
      }
    })();
  }, [routeSlug]);

  return (
    <>
      <section className="section">
        <div className="container">
          <h1 className="title is-spaced is-capitalized">{ route?.title }</h1>
          <h5 className="subtitle">
            { route?.grade }
            <span> </span>
            { route?.routeType }
          </h5>
          <p>{ route?.description }</p>
          <br />
          <div className="field is-grouped is-grouped-multiline">
            <div role="group" className="tags">
              {route?.tags.map(tag => (
                <label key={ tag } className="tag is-primary">
                  { tag }
                </label>
              ))} 
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container box">
          { route?.drawing
            ? <TopoImage
                routes={[route, ...route.siblingRoutes]}
                highlightedRouteSlug={ route.slug }
                background={ `${route?.topo?.image}` }
              />
            : ""
          }
        </div>
      </section>
    </>
  );
}

export default RoutePage;
