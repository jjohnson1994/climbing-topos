import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Area } from "core/types";
import { areas } from "../../api";
import AreaRoutesTable from "../../components/AreaRoutesTable";
import ButtonCopyCoordinates from "../../components/ButtonCopyCoordinates";
import LoadingSpinner from "../../components/LoadingSpinner";
import TopoImage from "../../components/TopoImage";
import { popupError } from '../../helpers/alerts';
import { usePageTitle } from "../../helpers/pageTitle";
import { useGlobals } from "../../api/globals";

function AreaView() {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
  const { areaSlug, cragSlug } = useParams<{ areaSlug: string; cragSlug: string }>();
  const [area, setArea] = useState<Area>();
  const { getOrientationsTitleById } = useGlobals();
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

  return (
    <>
      { loading && (
        <section className="section">
          <div className="container">
            <LoadingSpinner />
          </div>
        </section>
      )}
      <section className={`section ${ loading ? "is-hidden" : "" }`}>
        <div className="container">
          <div className="columns">
            <div className="column is-two-thirds">
              <h1 className="title is-spaced is-capitalized">{ area?.title }</h1>
              <h6 className="subtitle is-6">{ area?.description }</h6>
              <h6 className="subtitle is-6">{ area?.approachDetails }</h6>
            </div>
            <div className="column">
              <div role="group" className="tags is-capitalized">
                {area?.tags.map(tag => (
                  <label key={ tag } className="tag is-primary">
                    { tag }
                  </label>
                ))} 
              </div>
              <div className="buttons has-addons is-right">
                <ButtonCopyCoordinates
                  latitude={ `${area?.latitude}` }
                  longitude={ `${area?.longitude}` }
                />
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
      </section>

      { loading === false && area?.topos.length ? (
        <section className="section">
          {area?.topos && area?.topos.map((topo) => (
            <div key={ topo.slug } id={ topo.slug } className="container block">
              <div className="columns">
                <div className="column">
                  <TopoImage
                    routes={ area.routes?.filter(route => route.topoId === topo.id) }
                    background={ `${topo.image}` }
                  />
                </div>
                <div className="column">
                  <div className="block is-flex is-justify-content-space-between is-align-items-center">
                    <span className="icon-text">
                      <span className="icon">
                        <i className="fas fa-compass"></i>
                      </span>
                      <span className="is-capitalized">{ getOrientationsTitleById(topo.orientationId) }</span>
                    </span>
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
                  { area.routes?.filter(route => route.topoId === topo.id).length ? (
                    <div className="block box">
                      <AreaRoutesTable
                        routes={ area.routes?.filter(route => route.topoId === topo.id) }
                        loggedRoutes={ area.userLogs }
                      />
                    </div>
                  ) : "" }
                </div>
              </div>
            </div>
          ))}
        </section>
      ) : "" }

      { loading === false && area?.topos.length === 0 ? (
        <section className="section">
          <div className="container box">
            <p><b>There's nothing here... YET!</b><br/>Click "Add Topo" above to start uploding images and drawing routes</p>
          </div>
        </section>
      ) : ""}
    </>
  );
}

export default AreaView;
