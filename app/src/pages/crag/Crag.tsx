import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Crag } from "../../../../core/types";
import { getCragBySlug } from "../../api/crags";
import AreaRoutesTable from "../../components/AreaRoutesTable";
import ButtonCopyCoordinates from "../../components/ButtonCopyCoordinates";
import CragMap from "../../components/CragMap";
import LoadingSpinner from "../../components/LoadingSpinner";
import { popupError } from "../../helpers/alerts";
import { usePageTitle } from "../../helpers/pageTitle";

function CragView() {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
  const { cragSlug } = useParams<{ cragSlug: string }>();
  const [loading, setLoading] = useState(true);
  const [crag, setCrag] = useState<Crag>();
  const [activeTab, setActiveTab] = useState('routes');

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

  return (
    <>
      { loading ? (
        <section className="section">
          <div className="container">
            <LoadingSpinner />
          </div>
        </section>
      ) : (
        <>
          <section className="section">
            { crag && crag.access === "banned" && (
              <div className="notification is-danger">
                Climbing at this crag is <b>banned</b>, probably best to find somewhere else
              </div>
            )}
            <div className="container">
              <h1 className="title is-spaced is-capitalized">{ crag?.title }</h1>
              <h5 className="subtitle is-5">{ crag?.description }</h5>
              <div className="columns">
                <div className="column">
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
                </div>
                <div className="column is-flex is-justified-end">
                    <ButtonCopyCoordinates
                      latitude={ `${crag?.latitude}` }
                      longitude={ `${crag?.longitude}` }
                    />
                </div>
              </div>
            </div>
          </section>
          <section className="section">
            <div className="tabs">
              <ul>
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

            { activeTab === "areas" && (
              <div id="areas" className="container box">
                { crag?.areas.length ? (
                  <table className="table is-fullwidth">
                    <thead>
                      <tr>
                        <th>Title</th>
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
