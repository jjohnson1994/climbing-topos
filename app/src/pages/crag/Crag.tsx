import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { Area, Crag, Topo } from "core/types";
import { getCragBySlug } from "../../api/crags";
import AreaRoutesTable from "../../components/AreaRoutesTable";
import ButtonCopyCoordinates from "../../components/ButtonCopyCoordinates";
import CragMap from "../../components/CragMap";
import LoadingSpinner from "../../components/LoadingSpinner";
import TopoImage from "../../components/TopoImage";
import { popupError } from "../../helpers/alerts";
import { usePageTitle } from "../../helpers/pageTitle";
import CragTitleImage from "../../components/CragTitleImage";

function CragView() {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
  const { cragSlug } = useParams<{ cragSlug: string }>();
  const [loading, setLoading] = useState(true);
  const [crag, setCrag] = useState<Crag>();
  const [activeTab, setActiveTab] = useState("routes");

  usePageTitle(crag?.title);

  useEffect(() => {
    const doGetCrag = async () => {
      setLoading(true);

      try {
        const token = isAuthenticated
          ? await getAccessTokenSilently()
          : "";
        const newCrag = await getCragBySlug(cragSlug, token);
        setCrag(newCrag);

        if (newCrag.routes.length) {
          setActiveTab("guide");
        } else {
          setActiveTab("routes");
        }
      } catch (error) {
        console.error("Error loading crag", error);
        popupError("There was an error loading this crag. It's 90% your fault");
      } finally {
        setLoading(false);
      }
    };

    if (isLoading === false ) {
      doGetCrag();
    }
  }, [cragSlug, isLoading, isAuthenticated]);

  const areaTopos = (area: Area) => {
    return crag?.topos.filter(topo => topo.areaSlug === area.slug);
  }

  const topoRoutes = (topo: Topo) => {
    return crag?.routes.filter(route => route.topoSlug === topo.slug) || [];
  }

  return (
    <>
      { !crag || loading ? (
        <section className="section">
          <div className="container">
            <LoadingSpinner />
          </div>
        </section>
      ) : (
        <>
          <div className="columns is-gapless mb-0">
            <div className="column">
              <CragTitleImage src={ `${crag.image}` } />
            </div>
            <div className="column">
              <section className="section">
              { crag.access === "banned" && (
                <div className="notification is-danger">
                  Climbing at this crag is <b>banned</b>, probably best to find somewhere else
                </div>
              )}
                <div className="container">
                  <h1 className="title is-spaced is-capitalized">{ crag?.title }</h1>
                  <h5 className="subtitle is-5">{ crag?.description }</h5>
                  <div role="group" className="tags">
                    <label className={ `tag is-capitalized ${ crag?.access === "banned" ? "is-danger " : "is-primary" }` }>
                      Access { crag?.access }
                    </label>
                    { crag?.tags?.map(tag => (
                      <label key={ tag } className="tag is-primary">
                        { tag }
                      </label>
                    ))} 
                  </div>
                  <div className="buttons is-right">
                    <ButtonCopyCoordinates
                      latitude={ `${crag?.latitude}` }
                      longitude={ `${crag?.longitude}` }
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="tabs mb-0">
            <ul>
              { crag?.routes.length ? (
                <li className={ activeTab === 'guide' ? 'is-active' : '' }>
                  <a onClick={ () => setActiveTab('guide') }>Guide</a>
                </li>
              ): "" }
              <li className={ activeTab === 'routes' ? 'is-active' : '' }>
                <a onClick={ () => setActiveTab('routes') }>Routes</a>
              </li>
              <li className={ activeTab === 'areas' ? 'is-active' : '' }>
                <a onClick={ () => setActiveTab('areas') }>Areas</a>
              </li>
              <li className={ activeTab === 'approach' ? 'is-active' : '' }>
                <a onClick={ () => setActiveTab('approach') }>Approach</a>
              </li>
              <li className={ activeTab === 'map' ? 'is-active' : '' }>
                <a onClick={ () => setActiveTab('map') }>Map</a>
              </li>
            </ul>
          </div>

          <section className="section">
            { activeTab === "guide" && crag?.areas?.map(area => (
              <div key={ area.slug } className="container">
                <div className="block">
                  <div className="columns">
                    <div className="column is-two-thirds">
                      <Link to={ `/crags/${area.cragSlug}/areas/${area.slug}` }>
                        <h1 className="title" style={{ whiteSpace: "nowrap" }}>{ area.title }</h1>
                      </Link>
                      <p className="subtitle is-6">{ area.description }</p>
                    </div>
                    <div className="column">
                      <div className="tags">
                        { area.tags.map(tag => (
                          <label key={ tag } className="tag">{ tag }</label>
                        ))}
                      </div>
                      <div className="buttons is-right">
                        <ButtonCopyCoordinates
                          latitude={ area.latitude }
                          longitude={ area.longitude }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="block">
                  { areaTopos(area)?.filter(topo => topo.areaSlug === area.slug).map(topo =>(
                    <div key={ topo.slug } className={ `columns ${ topoRoutes(topo).length ? "" : "is-hidden" }` }>
                      <div className="column">
                        <TopoImage
                          routes={ topoRoutes(topo) }
                          background={ String(topo.image) }
                        />
                      </div>
                      <div className="column">
                        <div className="is-flex is-justify-content-flex-end">
                          <span className="icon-text">
                            <span className="icon">
                              <i className="fas fa-compass"></i>
                            </span>
                            <span className="is-capitalized">{ topo.orientation }</span>
                          </span>
                        </div>
                        <div className="mt-1">
                          <AreaRoutesTable
                            routes={ topoRoutes(topo) }
                            loggedRoutes= { crag.userLogs }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <hr />
              </div>
            ))}

            { activeTab === "routes" && (
              <div id="routes" className="container box">
                { crag?.routes.length ? (
                  <AreaRoutesTable
                    routes={ crag?.routes }
                    loggedRoutes={ (crag && crag.userLogs) || [] }
                  />
                ) : (
                  <p><b>This crag doesn't have any routes yet</b><br/>To start adding routes: you must first create an area, then upload a topo image</p>
                )}
              </div>
            )}
            { activeTab === "routes" && crag?.routes.length ? (
              <p className="has-text-centered"><b>Hint: </b>New routes can be added from an <b>areas</b> page</p>
            ) : ""}

            { activeTab === "areas" && (
              <div id="areas" className="container box">
                { crag?.areas.length ? (
                  <table className="table is-fullwidth">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Routes</th>
                        <th>Logs</th>
                      </tr>
                    </thead>
                    <tbody>
                      { crag?.areas?.map(area => (
                        <tr key={ area.slug }>
                          <td>
                            <Link
                              to={ `/crags/${cragSlug}/areas/${area.slug}` }
                              className="is-capitalized"
                            >
                              { area.title }
                            </Link>
                          </td>
                          <td>{ area.routeCount }</td>
                          <td>{ area.logCount }</td>
                        </tr>
                      )) }
                    </tbody>
                  </table>
                ) : (
                  <p><b>This crag doesn't have any areas yet</b><br/>Click below to start adding one</p>
                )}
                <div className="buttons is-centered">
                  <a className="button is-rounded" href={ `/crags/${cragSlug}/create-area` }>
                    <span className="icon is-small">
                      <i className="fas fa-plus"></i>
                    </span>
                    <span>Add Area</span>
                  </a>
                </div>
              </div>
            )}

            { activeTab === "approach" && (
              <div id="approach" className="container">
                <div className="box">
                  <h3 className="title">Approach</h3>
                  {(crag?.approachNotes &&
                    <p>{ crag?.approachNotes }</p>)
                    ||
                    <p>No approach details have been given. Hopefully that means it's an easy walk in 🤷‍♂️</p>
                  }
                </div>
                <div className="box">
                  <h3 className="title">Access</h3>
                  <span className="tag is-primary is-capitalized">{ crag?.access }</span>
                  <p>{ crag?.accessDetails }</p>
                  <p>{ crag?.accessLink }</p>
                </div>
              </div>
            )}

            { activeTab === "map" && crag && (
              <CragMap crag={ crag } />
            )}
          </section>
        </>
      )}
    </>
  );
};

export default CragView;
