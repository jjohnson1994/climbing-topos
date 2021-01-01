import {useAuth0} from "@auth0/auth0-react";
import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {AreaView, Route} from "../../../../core/types";
import {areas} from "../../api";
import {useLogRoutes} from '../../api/logs';
import AreaRoutesTable from "../../components/AreaRoutesTable";
import RoutesAddToLogModal from '../../components/RoutesAddToLogModal';
// import ButtonCopyCoordinates from '@/components/ButtonCopyCoordinates.svelte';
// import CragClimbsTable from "@/components/crag/CragClimbsTable.svelte";
import TopoImage from "../../components/TopoImage";
import {popupError, toastSuccess} from '../../helpers/alerts';
import {clipboardWriteText} from '../../helpers/clipboard';


function Area() {
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0();
  const { 
    selectedRoutes,
    isSelectingMultipleRoutes,
    onInitSelectMultipleRoutes,
    onRouteSelected,
    onRouteDeselected
  } = useLogRoutes();
  const { areaSlug, cragSlug } = useParams<{ areaSlug: string; cragSlug: string }>();
  const [area, setArea] = useState<AreaView>();
  const [showLogModal, setShowLogModal] = useState(false);

  useEffect(() => {
    const doGetArea = async () => {
      try {
        const token = isAuthenticated
          ? await getAccessTokenSilently()
          : "";
        const area = await areas.getArea(areaSlug, token);
        setArea(area);
      } catch (error) {
        console.error("Error loading area", error);
        popupError("Oh dear, there was a problem loading this area");
      }
    };

    doGetArea();
  }, [areaSlug, isAuthenticated]);

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
      <section className="section">
        <div className="container">
          <h1 className="title is-spaced is-capitalized">{ area?.title }</h1>
          <h5 className="subtitle">{ area?.description }</h5>
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
          {/**
          <ButtonCopyCoordinates
            latitude={ area?.latitude }
            longitude={ area?.longitude }
          />
          */}
        </div>
      </section>

      <section className="section">
        <div className="container">
        {area?.topos && area?.topos.map((topo) => (
          <div className="box block" key={ topo.slug }>
            <div className="columns">
              <div className="column is-half">
                <TopoImage
                  routes={ area.routes?.filter(route => route.topoSlug === topo.slug) }
                  background={ `${topo.image}` }
                />
              </div>
              <div className="column">
                <AreaRoutesTable
                  routes={ area.routes?.filter(route => route.topoSlug === topo.slug) }
                  loggedRoutes={ area.userLogs }
                  selectedRoutes={ selectedRoutes }
                  isSelectingMultiple={ isSelectingMultipleRoutes }
                  onInitSelectMultiple={ onInitSelectMultipleRoutes }
                  onRouteSelected={ onRouteSelected }
                  onRouteDeselected={ onRouteDeselected }
                />
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
        ))}
        </div>
      </section>

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

export default Area;
