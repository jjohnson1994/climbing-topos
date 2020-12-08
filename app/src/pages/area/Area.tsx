import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { clipboardWriteText } from '../../helpers/clipboard';
import { popupError, toastSuccess } from '../../helpers/alerts';
import { areas } from "../../api";
import { Area } from "../../../../core/types";

// import AreaTopoImage from '@/components/area/AreaTopoImage.svelte';
// import ButtonCopyCoordinates from '@/components/ButtonCopyCoordinates.svelte';
// import CragClimbsTable from "@/components/crag/CragClimbsTable.svelte";

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
  }, []);

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
        {/**
        {area?.topos.map((topo, index) => (
            <div className="box block">
              <div className="columns">
                <div className="column is-half">
                  <AreaTopoImage
                    climbs={ area.climbs.filter(({ topo_id }) => topo_id === topo.id) }
                    background={ topo.image_location }
                  />
                </div>
                <div className="column">
                  <CragClimbsTable
                    climbs={ area.climbs.filter(({ topo_id }) => topo_id === topo.id) }
                  />
                  <div className="buttons is-centered">
                    <a
                      href="/crags/{$page.params.crag}/areas/{$page.params.area}/topos/{topo.id}/create-route"
                      className="button is-rounded"
                    >
                      <span className="icon is-small">
                        <i className="fas fa-plus"></i>
                      </span>
                      <span>Add Route</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
          */}
        </div>
      </section>
    </>
  );
}

export default AreaView;
