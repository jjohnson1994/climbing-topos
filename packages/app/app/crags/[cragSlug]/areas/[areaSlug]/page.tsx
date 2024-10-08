"use client"

import { useEffect, useState } from "react";
import Link from "next/link"
import { Area, Crag, Topo } from "@climbingtopos/types";
import { areas, crags, topos } from "@/app/api";
import AreaRoutesTable from "@/app/components/AreaRoutesTable";
import ButtonCopyCoordinates from "@/app/components/ButtonCopyCoordinates";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import TopoImage from "@/app/components/TopoImage";
import { popupSuccess, popupError } from "@/app/helpers/alerts";
import Button, { Color } from "@/app/elements/Button";
import useUser from "@/app/api/user";
import Head from "next/head";

function AreaView({ params }: { params: { areaSlug: string; cragSlug: string } }) {
  const { areaSlug, cragSlug } = params;
  const [area, setArea] = useState<Area>();
  const [crag, setCrag] = useState<Crag>();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<Boolean>(false);
  const { userAttributes } = useUser();

  useEffect(() => {
    const doGetArea = async () => {
      try {
        setLoading(true);
        const [area, crag] = await Promise.all([
          areas.getArea(areaSlug),
          crags.getCragBySlug(cragSlug),
        ]);
        setArea(area);
        setCrag(crag);
      } catch (error) {
        console.error("Error loading area", error);
        popupError("Oh dear, there was a problem loading this area");
      } finally {
        setLoading(false);
      }
    };

    doGetArea();
  }, [areaSlug, cragSlug]);

  useEffect(() => {
    if (!crag?.managedBy.sub || !userAttributes?.attributes?.sub) {
      setIsAdmin(false);
    } else if (crag.managedBy.sub === userAttributes?.attributes?.sub) {
      setIsAdmin(true);
    }
  }, [userAttributes, crag]);

  const btnVerifyOnClick = async () => {
    try {
      if (!area) {
        return;
      }

      const verify = window.confirm(
        "Are you sure you want to verify this area?"
      );

      if (verify) {
        await areas.updateArea(area.slug, { verified: true });
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
        await topos.updateTopo(topoSlug, { verified: true });

        const newTopos = area.topos.reduce((acc: Topo[], cur) => {
          if (cur.slug === topoSlug) {
            return [
              ...acc,
              {
                ...cur,
                verified: true,
              },
            ];
          }

          return [...acc, cur];
        }, []);

        setArea({
          ...area,
          topos: newTopos,
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

      {area && crag && (
        <Head>
          <title>{area.title} | {area.cragTitle} | ClimbingTopos.com</title>
          <link rel="canonical" href={`https://climbingtopos.com/crags/${area.cragSlug}/areas/${area.slug}` }/>
          <meta name="description" content={`${area.title}, ${area.cragTitle} climbing guide and topo`}/>
          <meta property="og:type" content="website" />
          <meta property="og:title" content={`${area.title} | ${area.cragTitle} | ClimbingTopos.com`} />
          <meta property="og:url" content={`https://climbingtopos.com/crags/${area.cragSlug}/areas/${area.slug}` } />
          <meta property="og:description" content={`${area.title}, ${area.cragTitle} climbing guide and topo`} />
          <meta property="og:image" content={`${crag.image}`} />
        </Head>
      )}
      <section className={`section pt-5 ${loading ? "is-hidden" : ""}`}>
        <div className="container">
          <nav className="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li>
                <a href={`/crags/${area?.cragSlug}`}>{area?.cragTitle}</a>
              </li>
            </ul>
          </nav>
          <div className="columns">
            <div className="column is-two-thirds">
              <h1 className="title is-spaced is-capitalized">{area?.title}</h1>
              <h6 className="subtitle is-6">{area?.description}</h6>
              <h6 className="subtitle is-6">{area?.approachNotes}</h6>
              <h6 className="subtitle is-6">{area?.accessDetails}</h6>
              {isAdmin === true && area?.verified === false && (
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
                  href={`/crags/${cragSlug}/areas/${areaSlug}/create-topo`}
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
                        {isAdmin === true && topo.verified === false && (
                          <Button
                            color={Color.isSuccess}
                            onClick={() => btnVerifyTopoOnClick(`${topo.slug}`)}
                          >
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
                        href={`/crags/${cragSlug}/areas/${areaSlug}/topos/${topo.slug}/create-route`}
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
