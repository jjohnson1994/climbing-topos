import React, { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from 'react-router-dom';

import CragQuickActions from "../../components/CragQuickActions";
import { getCrags } from "../../api/crags";
import { CragView } from '../../../../core/types';

function Crags() {
  const [crags, setCrags] = useState<CragView[]>([]);
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (isLoading === false) {
      doGetCrags();
    }
  }, [isLoading, isAuthenticated]);

  async function doGetCrags() {
    try {
      const token = isAuthenticated
        ? await getAccessTokenSilently()
        : "";
      const crags = await getCrags(token).then(crags => crags.sort((cragA, cragB) => cragA.title > cragB.title ? 1 : -1));
      setCrags(crags);
    } catch (error) {
      console.error('Error loading crags', error);
    }
  }

  return (
    <React.Fragment>
      <section className="section">
        <div className="container">
          <h1 className="title">Find a Crag</h1>
          <div className="field is-grouped">
            <div className="control is-expanded has-icons-left">
              <span className="icon is-icon-left">
                <i className="fas fa-search"></i>
              </span>
              <input
                className="input is-rounded"
                type="text"
                placeholder="Search"
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
      </section>
      <section className="section">
        <div className="container">
          <div className="box">
            <table className="table is-hoverable is-fullwidth">
              <thead>
                <tr>
                  <td>Crag</td>
                  <td>Routes</td>
                  <td>Areas</td>
                  <td>Ticks</td>
                </tr>
              </thead>
              <tbody>
                {
                  crags.map(crag => (
                    <tr key={ crag.slug }>
                      <td>
                        <Link 
                          className="is-capitalized"
                          to={`/crags/${crag.slug}`}
                        >
                          { crag.title }
                        </Link>
                      </td>
                      <td><span>{ crag.routes.length }</span></td>
                      <td><span>{ crag.areas.length } </span></td>
                      <td><span>{ crag.logsCount }</span></td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </React.Fragment>
  )
}

export default Crags;
