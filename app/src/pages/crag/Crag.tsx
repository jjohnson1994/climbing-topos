import { useAuth0 } from "@auth0/auth0-react";
import leaflet from "leaflet";
import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Link, useParams } from "react-router-dom";
import { Crag, Route } from "../../../../core/types";
import { getCragBySlug } from "../../api/crags";
import { useLogRoutes } from "../../api/logs";
import AreaRoutesTable from "../../components/AreaRoutesTable";
import ButtonCopyCoordinates from "../../components/ButtonCopyCoordinates";
import MapMarkerClusterGroup from "../../components/LeafletMapMarkerClusterGroup";
import LoadingSpinner from "../../components/LoadingSpinner";
import RoutesAddToLogModal from "../../components/RoutesAddToLogModal";
import { popupError } from "../../helpers/alerts";
import { usePageTitle } from "../../helpers/pageTitle";

function CragView() {
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
  const [crag, setCrag] = useState<Crag>();
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

  const areaIcon = () => {
    return leaflet.divIcon({
      html: '<i class="fas fa-mountain fa-2x"></i>',
      iconSize: [20, 20],
      className: "icon"
    })
  }

  const carParkIcon = () => {
    return leaflet.divIcon({
      html: '<i class="fas fa-parking fa-2x"></i>',
      iconSize: [20, 20],
      className: "icon"
    })
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

            { activeTab === "map" && (
              <MapContainer
                className="markercluster-map"
                center={[
                  parseFloat(`${crag?.latitude}`),
                  parseFloat(`${crag?.longitude}`)
                ]}
                zoom={ 16 }
                scrollWheelZoom={false}
                style={{ height: "600px" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  maxZoom={ 20 }
                  maxNativeZoom={ 19 }
                />
                <MapMarkerClusterGroup>
                  <Marker
                    position={[
                      parseFloat(`${crag?.latitude}`),
                      parseFloat(`${crag?.longitude}`)
                    ]}
                  />
                  { crag?.carParks.map((carPark, index) => (
                    <Marker
                      key={ index }
                      icon={ carParkIcon() }
                      position={[
                        parseFloat(`${carPark.latitude}`),
                        parseFloat(`${carPark.longitude}`)
                      ]}
                    >
                      <Popup>
                        <h6 className="subtitle is-6">{ carPark.title }</h6>
                        <p className="subtitle">{ carPark.description }</p>
                        <ButtonCopyCoordinates
                          className="is-small"
                          latitude={ carPark.latitude }
                          longitude={ carPark.longitude }
                        />
                      </Popup>
                    </Marker>
                  ))}
                  { crag?.areas.map(area => (
                    <Marker
                      key={ area.slug }
                      icon={ areaIcon() }
                      position={[
                        parseFloat(`${area?.latitude}`),
                        parseFloat(`${area?.longitude}`)
                      ]}>
                      <Popup>
                        <h5 className="subtitle is-5">{ area.title }</h5>
                        <ButtonCopyCoordinates
                          className="is-small is-fullwidth"
                          latitude={ area.latitude }
                          longitude={ area.longitude }
                        />
                        <Link
                          className="button mt-1 is-small is-rounded is-fullwidth"
                          to={ `/crags/${area.cragSlug}/areas/${area.slug}` }
                        >
                          Open
                        </Link>
                      </Popup>
                    </Marker>
                  ))}
                </MapMarkerClusterGroup>
              </MapContainer>
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

export default CragView;
