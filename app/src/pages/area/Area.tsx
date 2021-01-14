import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Area, Route } from "core/types";
import { areas } from "../../api";
import { useLogRoutes } from '../../api/logs';
import AreaRoutesTable from "../../components/AreaRoutesTable";
import ButtonCopyCoordinates from "../../components/ButtonCopyCoordinates";
import LoadingSpinner from "../../components/LoadingSpinner";
import RoutesAddToLogModal from '../../components/RoutesAddToLogModal';
import TopoImage from "../../components/TopoImage";
import { popupError, toastSuccess } from '../../helpers/alerts';
import { clipboardWriteText } from '../../helpers/clipboard';
import { usePageTitle } from "../../helpers/pageTitle";

function AreaView() {
  const { getAccessTokenSilently, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const { 
    selectedRoutes,
    isSelectingMultipleRoutes,
    onInitSelectMultipleRoutes,
    onRouteSelected,
    onRouteDeselected
  } = useLogRoutes();
  const { areaSlug, cragSlug } = useParams<{ areaSlug: string; cragSlug: string }>();
  const [area, setArea] = useState<Area>();
  const [showLogModal, setShowLogModal] = useState(false);
  const [loading, setLoading] = useState(true);

  usePageTitle(area?.title);

  useEffect(() => {
    const doGetArea = async () => {
      try {
        setLoading(true);
        const token = isAuthenticated
          ? await getAccessTokenSilently()
          : "";
        const area = await areas.getArea(areaSlug, token);
        setArea(area);
      } catch (error) {
        console.error("Error loading area", error);
        popupError("Oh dear, there was a problem loading this area");
      } finally {
        setLoading(false);
      }
    };

    if (isLoading === false) {
      doGetArea();
    }
  }, [areaSlug, isAuthenticated, isLoading]);

  const btnCoordsOnClick = async () => {
    if (!area) return;

    try {
      await clipboardWriteText(`${area.latitude}, ${area.longitude}`);
      toastSuccess('Coordinates have been saved to your clipboard');
    } catch (error) {
      console.error('Error saving area coords to clipboard', error);
    }
  }

  const btnSaveMultipleToListOnClick = () => {
    if (isAuthenticated === false) {
      loginWithRedirect();
    } else {
      // TODO
    }
  }

  const btnDoneMultipleOnClick = async () => {
    if (isAuthenticated === false) {
      loginWithRedirect();
    } else {
      setShowLogModal(true);
    }
  }

  return (
    <>
      <RoutesAddToLogModal
        routes={ area?.routes?.filter(route => selectedRoutes.includes(`${route.slug}`)) as Route[] }
        visible={ showLogModal } 
        onCancel={ () => setShowLogModal(false) }
        onConfirm={ () => setShowLogModal(false) }
      />
      { loading && (
        <section className="section">
          <div className="container">
            <LoadingSpinner />
          </div>
        </section>
      )}
      <section className={`section ${ loading ? "is-hidden" : "" }`}>
        <div className="container">
          <h1 className="title is-spaced is-capitalized">{ area?.title }</h1>
          <h5 className="subtitle is-5">{ area?.description }</h5>
          <h5 className="subtitle is-5">{ area?.approachNotes }</h5>
          <h5 className="subtitle is-5">{ area?.accessDetails }</h5>
          <div className="columns">
            <div className="column">
              <div role="group" className="tags">
                <label className={ `tag is-capitalized ${ area?.access === "banned" ? "is-danger " : "is-primary" }` }>
                  Access { area?.access }
                </label>
                {area?.tags.map(tag => (
                  <label key={ tag } className="tag is-primary">
                    { tag }
                  </label>
                ))} 
              </div>
            </div>
            <div className="column is-flex is-justified-end">
              <div className="is-flex is-justify-content-flex-end">
                <ButtonCopyCoordinates
                  latitude={ `${area?.latitude}` }
                  longitude={ `${area?.longitude}` }
                />
                <span className="mr-2"></span>
                <div className="buttons has-addons is-right">
                  <Link
                    to={ `/crags/${cragSlug}/areas/${areaSlug}/create-topo` }
                    className="button is-rounded"
                  >
                    <span className="icon is-small">
                      <i className="fas fa-plus"></i>
                    </span>
                    <span>Add Topo</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {area?.topos && area?.topos.map((topo) => (
        <>
          <div key={ topo.slug }>
            <div className="is-hidden-tablet">
              <TopoImage
                routes={ area.routes?.filter(route => route.topoSlug === topo.slug) }
                background={ `${topo.image}` }
              />
            </div>
            <section className="section">
              <div className="container">
                <div className="box block" key={ topo.slug }>
                  <div className="columns">
                    <div className="column is-half-table is-two-thirds-desktop is-hidden-mobile">
                      <TopoImage
                        routes={ area.routes?.filter(route => route.topoSlug === topo.slug) }
                        background={ `${topo.image}` }
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
                      { area.routes?.filter(route => route.topoSlug === topo.slug).length ? (
                        <AreaRoutesTable
                          routes={ area.routes?.filter(route => route.topoSlug === topo.slug) }
                          loggedRoutes={ area.userLogs }
                          selectedRoutes={ selectedRoutes }
                          isSelectingMultiple={ isSelectingMultipleRoutes }
                          onInitSelectMultiple={ onInitSelectMultipleRoutes }
                          onRouteSelected={ onRouteSelected }
                          onRouteDeselected={ onRouteDeselected }
                        />
                      ) : ""}
                      <div className="buttons is-centered">
                        <Link
                          to={ `/crags/${cragSlug}/areas/${areaSlug}/topos/${topo.slug}/create-route` }
                          className="button is-rounded"
                        >
                          <span className="icon is-small">
                            <i className="fas fa-plus"></i>
                          </span>
                          <span>Add Route</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </>
      ))}

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
      }
    </>
  );
}

export default AreaView;
