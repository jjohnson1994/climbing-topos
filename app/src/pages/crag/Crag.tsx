import {useAuth0} from "@auth0/auth0-react";
import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {CragView, Route} from "../../../../core/types";
import {getCragBySlug} from "../../api/crags";
import {useLogRoutes} from "../../api/logs";
import AreaRoutesTable from "../../components/AreaRoutesTable";
import ButtonCopyCoordinates from "../../components/ButtonCopyCoordinates";
import LoadingSpinner from "../../components/LoadingSpinner";
import RoutesAddToLogModal from "../../components/RoutesAddToLogModal";
import LeafletMap from "../../components/LeafletMap";
import {popupError} from "../../helpers/alerts";
import {usePageTitle} from "../../helpers/pageTitle";

import leaflet from "leaflet";

function Crag() {
  const { getAccessTokenSilently, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const { 
    selectedRoutes,
    isSelectingMultipleRoutes,
    onInitSelectMultipleRoutes,
    onRouteSelected,
    onRouteDeselected
  } = useLogRoutes();
  const { cragSlug } = useParams<{ cragSlug: string }>();
  const [loading, setLoading] = useState(true);
  const [crag, setCrag] = useState<CragView>();
  const [activeTab, setActiveTab] = useState('routes');
  const [showLogModal, setShowLogModal] = useState(false);

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

  const btnSaveMultipleToListOnClick = () => {
    // TODO repetition with Area.tsx
    if (isAuthenticated === false) {
      loginWithRedirect();
    } else {
      // TODO
    }
  }

  const btnDoneMultipleOnClick = async () => {
    // TODO repetition with Area.tsx
    if (isAuthenticated === false) {
      loginWithRedirect();
    } else {
      setShowLogModal(true);
    }
  }

  const createMapMarkers = () => {
    const markers = [
      leaflet.marker([parseFloat(`${crag?.latitude}`), parseFloat(`${crag?.longitude}`)]),
      ...(crag?.carParks ? crag?.carParks.map(carPark => {
        return leaflet
        .marker([parseFloat(carPark.latitude), parseFloat(carPark.longitude)], {
          icon: leaflet.divIcon({
            html: '<i class="fas fa-parking fa-2x"></i>',
            iconSize: [20, 20],
          })
        })
        .bindPopup(`<span>${carPark.title}</span><br/><span>${carPark.latitude}, ${crag.longitude}</span>`);
      }) : [])
    ]

    return markers;
  }

  return (
    <>
      <RoutesAddToLogModal
        routes={ crag?.routes?.filter(route => selectedRoutes.includes(`${route.slug}`)) as Route[] }
        visible={ showLogModal } 
        onCancel={ () => setShowLogModal(false) }
        onConfirm={ () => setShowLogModal(false) }
      />
      { loading ? (
        <section className="section">
          <div className="container">
            <LoadingSpinner />
          </div>
        </section>
      ) : (
        <>
          <section className="section">
            <div className="container">
              <h1 className="title is-spaced is-capitalized">{ crag?.title }</h1>
              <h5 className="subtitle">{ crag?.description }</h5>
              <div className="is-flex is-justify-content-flex-end">
                <ButtonCopyCoordinates
                  latitude={ `${crag?.latitude}` }
                  longitude={ `${crag?.longitude}` }
                />
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
                    selectedRoutes={ selectedRoutes }
                    isSelectingMultiple={ isSelectingMultipleRoutes }
                    onInitSelectMultiple={ onInitSelectMultipleRoutes }
                    onRouteSelected={ onRouteSelected }
                    onRouteDeselected={ onRouteDeselected }
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
              <div id="approach" className="container box">
                <div className="block">
                  <h3 className="title">Approach</h3>
                  {(crag?.approachNotes &&
                    <p>{ crag?.approachNotes }</p>)
                    ||
                    <p>No approach details have been given. Hopefully that means it's an easy walk in 🤷‍♂️</p>
                  }
                </div>
                <hr />
                <div className="block">
                  <h3 className="title">Parking</h3>
                  {crag?.carParks?.map((carPark, index) => (
                    <React.Fragment key={ index }>
                      <div className="is-flex">
                        <h4 className="title is-4 is-capitalized">{ carPark.title }</h4>
                        <span className="ml-2"></span>
                        <ButtonCopyCoordinates
                          latitude={ carPark.latitude }
                          longitude={ carPark.longitude }
                        />
                      </div>
                      <p className={ carPark.description ? 'm-4' : '' }>
                        { carPark.description ? carPark.description : '' }
                      </p>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            { activeTab === "map" && (
              <div>
                <LeafletMap
                  markers={ createMapMarkers() }
                  center={[
                    parseFloat(`${crag?.latitude}`),
                    parseFloat(`${crag?.longitude}`)
                  ]}
                  zoom={ 15 }
                />
              </div>
            )}
          </section>
        </>
      )}

      { /** TODO repetition with Area.tsx */ }
      {selectedRoutes.length 
        ? (
          <nav
            className="navbar has-shadow is-fixed-bottom"
            role="navigation"
          >
            <div className="is-justify-content-flex-end navbar-item" style={{  width: "100%"  }}>
              <div className="buttons">
                <button className="button is-outlined" onClick={ btnSaveMultipleToListOnClick }>
                  <span className="icon">
                    <i className="fas fw fa-list"></i>
                  </span>
                  <span>Save to List</span>
                </button>
                <button className="button is-primary" onClick={ btnDoneMultipleOnClick }>
                  <span className="icon">
                    <i className="fas fw fa-check"></i>
                  </span>
                  <span>Done</span>
                </button>
              </div>
            </div>
          </nav>
        )
        : ""
      }   </>
  );
};

export default Crag;
