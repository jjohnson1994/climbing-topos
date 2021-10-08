import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Area, Topo } from "core/types";
import { areas, topos } from "../../api";
import AreaRoutesTable from "../../components/AreaRoutesTable";
import ButtonCopyCoordinates from "../../components/ButtonCopyCoordinates";
import LoadingSpinner from "../../components/LoadingSpinner";
import TopoImage from "../../components/TopoImage";
import { popupSuccess, popupError } from "../../helpers/alerts";
import { usePageTitle } from "../../helpers/pageTitle";
import Button, { Color } from "../../elements/Button";

function AreaView() {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
  const { areaSlug, cragSlug } =
    useParams<{ areaSlug: string; cragSlug: string }>();
  const [area, setArea] = useState<Area>();
  const [loading, setLoading] = useState(true);

  usePageTitle(area?.title);

  useEffect(() => {
    const doGetArea = async () => {
      try {
        setLoading(true);
        const token = isAuthenticated ? await getAccessTokenSilently() : "";
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

  const btnVerifyOnClick = async () => {
    try {
      if (!area) {
        return;
      }

      const verify = window.confirm(
        "Are you sure you want to verify this area?"
      );

      if (verify) {
        const token = await getAccessTokenSilently();
        await areas.updateArea(area.slug, { verified: true }, token);
        setArea({
          ...area,
          verified: true,
        });
        popupSuccess("Area Verified");
      }
    } catch (error) {
      console.error("error updating area", error);
    }
  };

  const btnVerifyTopoOnClick = async (topoSlug: string) => {
    try {
      if (!area) {
        return;
      }

      const verify = window.confirm(
        "Are you sure you want to verify this topo?"
      );

      if (verify) {
        const token = await getAccessTokenSilently();
        await topos.updateTopo(topoSlug, { verified: true }, token);

        const newTopos = area.topos.reduce((acc: Topo[], cur) => {
          if (cur.slug === topoSlug) {
            return [
              ...acc,
              {
                ...cur,
                verified: true
              }
            ]
          }

          return [ ...acc, cur ]
        }, [])

        setArea({
          ...area,
          topos: newTopos
        });
        popupSuccess("Topo Verified");
      }
    } catch (error) {
      console.error("error updating area", error);
    }
  };

  return (
    <>
      {loading && (
        <section className="section">
          <div className="container">
            <LoadingSpinner />
          </div>
        </section>
      )}
      <section className={`section ${loading ? "is-hidden" : ""}`}>
        <div className="container">
          <div className="columns">
            <div className="column is-two-thirds">
              <h1 className="title is-spaced is-capitalized">{area?.title}</h1>
              <h6 className="subtitle is-6">{area?.description}</h6>
              <h6 className="subtitle is-6">{area?.approachNotes}</h6>
              <h6 className="subtitle is-6">{area?.accessDetails}</h6>
              {area?.verified === false && (
                <Button color={Color.isSuccess} onClick={btnVerifyOnClick}>
                  <span className="icon">
                    <i className="fas fa-check"></i>
                  </span>
                  <span>Verify Area</span>
                </Button>
              )}
            </div>
            <div className="column">
              <div role="group" className="tags">
                {area?.verified === false && (
                  <span className="tag is-info">Awaiting Verification</span>
                )}
                <span
                  className={`tag is-capitalized ${
                    area?.access === "banned" ? "is-danger " : ""
                  }`}
                >
                  Access {area?.access}
                </span>
                {area?.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="buttons has-addons is-right">
                <ButtonCopyCoordinates
                  latitude={`${area?.latitude}`}
                  longitude={`${area?.longitude}`}
                />
                <Link
                  to={`/crags/${cragSlug}/areas/${areaSlug}/create-topo`}
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

      {loading === false && area?.topos.length ? (
        <section className="section">
          {area?.topos &&
            area?.topos.map((topo) => (
              <div key={topo.slug} id={topo.slug} className="container block">
                <div className="columns">
                  <div className="column">
                    <TopoImage
                      routes={area.routes?.filter(
                        (route) => route.topoSlug === topo.slug
                      )}
                      background={`${topo.image}`}
                    />
                  </div>
                  <div className="column">
                    <div className="block is-flex is-justify-content-space-between is-align-items-center">
                      <span>
                        {topo.verified === false && (
                          <Button color={Color.isSuccess} onClick={ () => btnVerifyTopoOnClick(`${topo.slug}`) }>
                            <span className="icon">
                              <i className="fas fa-check"></i>
                            </span>
                            <span>Verify Topo</span>
                          </Button>
                        )}
                        <span className="icon-text">
                          <span className="icon">
                            <i className="fas fa-compass"></i>
                          </span>
                          <span className="is-capitalized">
                            {topo.orientation}
                          </span>
                        </span>
                      </span>
                      <Link
                        to={`/crags/${cragSlug}/areas/${areaSlug}/topos/${topo.slug}/create-route`}
                        className="button is-rounded"
                      >
                        <span className="icon is-small">
                          <i className="fas fa-plus"></i>
                        </span>
                        <span>Add Route</span>
                      </Link>
                    </div>
                    {area.routes?.filter(
                      (route) => route.topoSlug === topo.slug
                    ).length ? (
                      <div className="block">
                        <AreaRoutesTable
                          routes={area.routes?.filter(
                            (route) => route.topoSlug === topo.slug
                          )}
                          loggedRoutes={area.userLogs}
                        />
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            ))}
        </section>
      ) : (
        ""
      )}

      {loading === false && area?.topos.length === 0 ? (
        <section className="section">
          <div className="container box">
            <p>
              <b>There's nothing here... YET!</b>
              <br />
              Click "Add Topo" above to start uploding images and drawing routes
            </p>
          </div>
        </section>
      ) : (
        ""
      )}
    </>
  );
}

export default AreaView;
