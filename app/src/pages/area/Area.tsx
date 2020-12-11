import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { clipboardWriteText } from '../../helpers/clipboard';
import { popupError, toastSuccess } from '../../helpers/alerts';
import { areas } from "../../api";
import { Area } from "../../../../core/types";

// import ButtonCopyCoordinates from '@/components/ButtonCopyCoordinates.svelte';
// import CragClimbsTable from "@/components/crag/CragClimbsTable.svelte";

import TopoImage from "../../components/TopoImage";
import AreaRoutesTable from "../../components/AreaRoutesTable";

function AreaView() {
  const { areaSlug, cragSlug } = useParams<{ areaSlug: string; cragSlug: string }>();
  const [area, setArea] = useState<Area | undefined>();

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

  return (
    <>
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
                {/*
                <CragClimbsTable
                  climbs={ area.climbs.filter(({ topo_id }) => topo_id === topo.id) }
                />
                */}
                <AreaRoutesTable routes={ area.routes?.filter(route => route.topoSlug === topo.slug) } />
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
    </>
  );
}

export default AreaView;
