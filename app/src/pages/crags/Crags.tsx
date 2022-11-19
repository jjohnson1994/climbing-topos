import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getCrags } from "../../api/crags";
import { CragBrief } from "core/types";
import LoadingSpinner from "../../components/LoadingSpinner";

function Crags() {
  const [crags, setCrags] = useState<CragBrief[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const doGetCrags = async () => {
      try {
        setLoading(true);
        const crags = await getCrags().then((crags) =>
          crags.sort((cragA, cragB) => (cragA.title > cragB.title ? 1 : -1))
        );
        setCrags(crags);
      } catch (error) {
        console.error("Error loading crags", error);
      } finally {
        setLoading(false);
      }
    };

    doGetCrags();
  }, []);

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
                <Link to="/create-crag" className="button is-rounded">
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
          {crags.map((crag) => (
            <div key={crag.slug} className="block">
              <Link key={crag.slug} to={`/crags/${crag.slug}`}>
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
