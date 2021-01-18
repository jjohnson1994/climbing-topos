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

function AreaView() {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
  const { areaSlug, cragSlug } = useParams<{ areaSlug: string; cragSlug: string }>();
  const [area, setArea] = useState<Area>();
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
          <h1 className="title is-spaced is-capitalized">{ area?.title }</h1>
          <h6 className="subtitle is-6">{ area?.description }</h6>
          <h6 className="subtitle is-6">{ area?.approachNotes }</h6>
          <h6 className="subtitle is-6">{ area?.accessDetails }</h6>
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

      <section className="section">
        {area?.topos && area?.topos.map((topo) => (
          <div key={ topo.slug } className="container block">
            <div className="columns">
              <div className="column">
                <TopoImage
                  routes={ area.routes?.filter(route => route.topoSlug === topo.slug) }
                  background={ `${topo.image}` }
                />
              </div>
              <div className="column">
                <div className="block is-flex is-justify-content-space-between">
                  <span className="icon-text">
                    <span className="icon">
                      <i className="fas fa-compass"></i>
                    </span>
                    <span className="is-capitalized">{ topo.orientation }</span>
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
                <div className="block box">
                  { area.routes?.filter(route => route.topoSlug === topo.slug).length ? (
                    <AreaRoutesTable
                      routes={ area.routes?.filter(route => route.topoSlug === topo.slug) }
                      loggedRoutes={ area.userLogs }
                    />
                  ) : ""}
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      { loading === false && area?.topos.length === 0 && (
        <section className="section">
          <div className="container box">
            <p><b>There's nothing here... YET!</b><br/>Click "Add Topo" above to start uploding images and drawing routes</p>
          </div>
        </section>
      )}
    </>
  );
}

export default AreaView;
