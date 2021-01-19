import React, { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from 'react-router-dom';

import { getCrags } from "../../api/crags";
import { CragBrief } from '../../../../core/types';
import LoadingSpinner from '../../components/LoadingSpinner';

function Crags() {
  const [crags, setCrags] = useState<CragBrief[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (isLoading === false) {
      doGetCrags();
    }
  }, [isLoading, isAuthenticated]);

  async function doGetCrags() {
    try {
      setLoading(true);
      const token = isAuthenticated
        ? await getAccessTokenSilently()
        : "";
      const crags = await getCrags(token).then(crags => crags.sort((cragA, cragB) => cragA.title > cragB.title ? 1 : -1));
      setCrags(crags);
    } catch (error) {
      console.error('Error loading crags', error);
    } finally {
      setLoading(false);
    }
  }

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
          <div className="block">
            { loading && <LoadingSpinner /> }
            { crags.map(crag => (
              <Link key={ crag.slug } to={ `/crags/${crag.slug}` }>
                <div className="block box">
                  <div className="is-flex is-flex-column">
                    <p className="is-capitalized"><b>{ crag.title }</b></p>
                    <div className="columns">
                      <div className="column">
                        <p className="is-capitalized">{ crag.description }</p>
                      </div>
                      <div className="column">
                        <div className="tags is-justify-content-flex-end">
                          <span className="tag">Routes { crag.routeCount }</span>
                          <span className="tag">Areas { crag.areaCount }</span>
                          <span className="tag">Logs { crag.logCount }</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </React.Fragment>
  )
}

export default Crags;
