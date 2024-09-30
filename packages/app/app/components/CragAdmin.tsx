import { Area, Crag, Route, Topo } from "core/types";
import { useEffect, useState } from "react";
import { popupError } from "../helpers/alerts";
import { getCragItemsAwaitingAproval } from "../api/crags";
import LoadingSpinner from "./LoadingSpinner";
import Link from "next/link"
import useUser from "../api/user";

interface CragAdminProps {
  crag: Crag;
}

const CragAdmin = (props: CragAdminProps) => {
  const { isAuthenticated } = useUser();
  const [loading, setLoading] = useState<Boolean>(false);
  const [itemsAwaitingApproval, setItemsAwaitingApproval] = useState<
    Array<Topo | Area | Route>
  >([]);

  useEffect(() => {
    const getAdminCragActions = async () => {
      try {
        setLoading(true);
        const itemsAwaitingAproval = await getCragItemsAwaitingAproval(
          props.crag.slug
        );

        setItemsAwaitingApproval(itemsAwaitingAproval);
      } catch (error) {
        console.error("Error loading crag admin actions", error);
        popupError("There was an error loading this crag. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      getAdminCragActions();
    }
  }, [isAuthenticated, props.crag.slug]);

  const renderTopoListItem = (topo: Topo) => (
    <Link href={`/crags/${topo.cragSlug}/areas/${topo.areaSlug}#${topo.slug}`}>
      <div className="block box p-0 mb-5" style={{ overflow: "hidden" }}>
        <div className="columns is-mobile is-gapless">
          <div className="column is-narrow">
            <img
              src={`${topo.image}`}
              className="image is-128x128"
              alt="new topo"
              style={{
                objectFit: "cover",
                height: "100%",
              }}
            />
          </div>
          <div className="column m-3">
            <div className="tags">
              <span className="tag is-info">New Topos</span>
            </div>
            <p className="is-size-7">Uploaded by {topo.createdBy.nickname}</p>
          </div>
        </div>
      </div>
    </Link>
  );

  const renderRouteListItem = (route: Route) => (
    <Link
      href={`/crags/${route.cragSlug}/areas/${route.areaSlug}/topo/${route.topoSlug}/routes/${route.slug}`}
    >
      <div className="block box p-0 mb-5" style={{ overflow: "hidden" }}>
        <div className="columns is-mobile is-gapless">
          <div className="column m-3">
            <p className="is-capitalized mb-1">
              <b>{route.title}</b>
            </p>
            <div className="tags">
              <span className="tag is-info">New Route</span>
              {route.tags.map((tag) => (
                <span className="tag">{tag}</span>
              ))}
            </div>
            <p className="is-size-7">Uploaded by {route.createdBy.nickname}</p>
          </div>
        </div>
      </div>
    </Link>
  );

  const renderAreaListItem = (area: Area) => (
    <Link href={`/crags/${area.cragSlug}/areas/${area.slug}`}>
      <div className="block box p-0 mb-5" style={{ overflow: "hidden" }}>
        <div className="columns is-mobile is-gapless">
          <div className="column m-3">
            <p className="is-capitalized mb-1">
              <b>{area.title}</b>
            </p>
            <div className="tags">
              <span className="tag is-info">New Area</span>
              <span className="tag">{area.rockType}</span>
              <span className="tag">Access {area.access}</span>
              {area.tags.map((tag) => (
                <span className="tag">{tag}</span>
              ))}
            </div>
            <p className="is-size-7">Uploaded by {area.createdBy.nickname}</p>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <>
      {loading && (
        <section className="section">
          <div className="container">
            <LoadingSpinner />
          </div>
        </section>
      )}
      {!loading && (
        <div className="container">
          <h1 className="title">Awaiting Approval</h1>
          <div>
            {itemsAwaitingApproval.length === 0 && (
              <p>There are no items awaiting approval</p>
            )}
          </div>
          <div>
            {itemsAwaitingApproval.map((itemAwaitingApproval) => {
              if (itemAwaitingApproval.model === "route") {
                return (
                  <div key={itemAwaitingApproval.slug}>
                    {renderRouteListItem(
                      itemAwaitingApproval as unknown as Route
                    )}
                  </div>
                );
              }

              if (itemAwaitingApproval.model === "area") {
                return (
                  <div key={itemAwaitingApproval.slug}>
                    {renderAreaListItem(
                      itemAwaitingApproval as unknown as Area
                    )}
                  </div>
                );
              }

              if (itemAwaitingApproval.model === "topo") {
                return (
                  <div key={itemAwaitingApproval.slug}>
                    {renderTopoListItem(
                      itemAwaitingApproval as unknown as Topo
                    )}
                  </div>
                );
              }

              return "";
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default CragAdmin;
