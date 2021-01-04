import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {RouteView} from "../../../../core/types";
import {routes} from "../../api";
import TopoImage from "../../components/TopoImage";
import {usePageTitle} from "../../helpers/pageTitle";


function RoutePage() {
  const { cragSlug, areaSlug, topoSlug, routeSlug } = useParams<{ cragSlug: string; areaSlug: string; topoSlug: string; routeSlug: string }>();
  const [route, setRoute] = useState<RouteView>();
  usePageTitle(route?.title);

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
          <div className="columns">
            <div className="column">
              <div role="group" className="tags">
                {route?.tags.map(tag => (
                  <label key={ tag } className="tag is-primary">
                    { tag }
                  </label>
                ))} 
              </div>
            </div>
            <div className="column is-flex is-justified-end">
              <div className="field has-addons">
                <div className="control">
                  { route?.userLogs.length
                    ? ( 
                      <button className="button is-rounded">
                        <span className="icon is-small">
                          <i className="fas fw fa-plus"></i>
                        </span>
                        <span>Log Book</span>
                      </button>
                    )
                    : (
                      <button className="button is-rounded">
                        <span className="icon is-small">
                          <i className="fas fw fa-check"></i>
                        </span>
                        <span>Done</span>
                      </button>
                    )
                  }
                </div>
                <div className="control">
                  <button className="button is-rounded">
                    <span className="icon is-small">
                      <i className="fas fw fa-list"></i>
                    </span>
                    <span>Save to List</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="is-hidden-tablet">
        { route?.drawing
          ? <TopoImage
              routes={[route, ...route.siblingRoutes]}
              highlightedRouteSlug={ route.slug }
              background={ `${route?.topo?.image}` }
            />
          : ""
        }
      </section>
      <section className="section is-hidden-mobile">
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
