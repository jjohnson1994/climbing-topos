import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";

import { clipboardWriteText } from '../../helpers/clipboard';
import { popupError, toastSuccess } from '../../helpers/alerts';
import { areas } from "../../api";
import { Area, Route } from "../../../../core/types";
// import ButtonCopyCoordinates from '@/components/ButtonCopyCoordinates.svelte';
// import CragClimbsTable from "@/components/crag/CragClimbsTable.svelte";
import TopoImage from "../../components/TopoImage";
import AreaRoutesTable from "../../components/AreaRoutesTable";
import RoutesAddToLogModal from '../../components/RoutesAddToLogModal';

function AreaView() {
  const { user, isAuthenticated, getAccessTokenWithPopup, loginWithRedirect } = useAuth0();
  const { areaSlug, cragSlug } = useParams<{ areaSlug: string; cragSlug: string }>();
  const [area, setArea] = useState<Area | undefined>();
  const [selectMultiple, setSelectMultiple] = useState(false);
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>([]);
  const [showLogModal, setShowLogModal] = useState(false);

  useEffect(() => {
    const doGetArea = async () => {
      try {
        const area = await areas.getArea(areaSlug);
        setArea(area);
      } catch (error) {
        console.error("Error loading area", error);
        popupError("Oh dear, there was a problem loading this area");
      }
    };

    doGetArea();
  }, [areaSlug]);

  const btnCoordsOnClick = async () => {
    if (!area) return;

    try {
      await clipboardWriteText(`${area.latitude}, ${area.longitude}`);
      toastSuccess('Coordinates have been saved to your clipboard');
    } catch (error) {
      console.error('Error saving area coords to clipboard', error);
    }
  }

  const onInitSelectMultiple = (selectMultiple: boolean, routeSlug: string) => {
    setSelectMultiple(selectMultiple);
    setSelectedRoutes([ routeSlug ]);
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

  const onRouteSelected = (routeSlug: string) => {
    const newSelectedRoutes = Array.from(new Set([ ...selectedRoutes, routeSlug ]));
    setSelectedRoutes(newSelectedRoutes);
  }
  
  const onRouteDeselected = (routeSlug: string) => {
    const newSelectedRoutes = selectedRoutes.filter(_routeSlug => _routeSlug !== routeSlug)
    setSelectedRoutes(newSelectedRoutes);

    if (newSelectedRoutes.length === 0) {
      setSelectMultiple(false);
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
                  background={ topo.image }
                />
              </div>
              <div className="column">
                <AreaRoutesTable
                  routes={ area.routes?.filter(route => route.topoSlug === topo.slug) }
                  selectedRoutes={ selectedRoutes }
                  isSelectingMultiple={ selectMultiple }
                  onInitSelectMultiple={ onInitSelectMultiple }
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

export default AreaView;
