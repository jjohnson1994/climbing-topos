import React  from "react";
import Link from "next/link";

import { getCrags } from "@/app/api/crags";
import { CragBrief } from "@climbingtopos/types";
import LoadingSpinner from "@/app/components/LoadingSpinner";

async function Crags() {
  const loading = false

  const crags = await getCrags().then((crags) =>
    crags.sort((cragA, cragB) => (cragA.title > cragB.title ? 1 : -1))
  ).catch(error => {
      console.error(error)
    });

  return (
    <React.Fragment>
      <section className="section">
        <div className="container">
          <div className="block">
            <div className="field is-grouped">
              <div className="control is-expanded has-icons-left">
                <span className="icon is-icon-left">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  className="input is-rounded"
                  type="text"
                  placeholder="Filter"
                />
              </div>
              <div className="control">
                <Link href="/create-crag" className="button is-rounded">
                  <span className="icon is-small">
                    <i className="fas fa-plus"></i>
                  </span>
                  <span>Add Crag</span>
                </Link>
              </div>
            </div>
          </div>
          {loading && (
            <div className="block">
              <LoadingSpinner />
            </div>
          )}
          {crags?.map((crag) => (
            <div key={crag.slug} className="block">
              <Link key={crag.slug} href={`/crags/${crag.slug}`}>
                <div className="block box p-0" style={{ overflow: "hidden" }}>
                  <div className="columns is-mobile is-gapless">
                    <div className="column is-narrow">
                      <img
                        src={`${crag.image}`}
                        className="image is-128x128"
                        alt={crag.title}
                        style={{
                          objectFit: "cover",
                          height: "100%",
                        }}
                      />
                    </div>
                    <div className="column m-3">
                      <p className="is-capitalized">
                        <b>{crag.title}</b> {crag.osmData.address.county},{" "}
                        {crag.osmData.address.country}
                      </p>
                      <div className="tags">
                        <span className="tag">Routes {crag.routeCount}</span>
                        <span className="tag">Areas {crag.areaCount}</span>
                        <span className="tag">Logs {crag.logCount}</span>
                      </div>
                      <p className="is-capitalized">
                        {crag.description.substring(0, 280)}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </React.Fragment>
  );
}

export default Crags;
