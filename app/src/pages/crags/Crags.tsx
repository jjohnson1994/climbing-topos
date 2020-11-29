import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import CragQuickActions from "../../components/CragQuickActions";
import { useCrags } from "../../api/crags";

function Crags() {
  const { crags, getCrags } = useCrags();

  useEffect(() => {
    doGetCrags();
  });

  async function doGetCrags() {
    getCrags();
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
              <button className="button is-rounded">
                <span className="icon">
                  <i className="fas fa-map-marker-alt"></i>
                </span>
                <span>Find Me</span>
              </button>
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
                  <td>Likes</td>
                </tr>
              </thead>
              <tbody>
                {
                  crags.map(crag => (
                    <tr key={ crag.slug }>
                      <td>
                        <Link 
                          className="is-capitalized"
                          rel='prefetch'
                          to={`/crag/${crag.slug}`}
                        >
                          { crag.title }
                        </Link>
                      </td>
                      <td><span>{ crag.climbCount }</span></td>
                      <td><span>{ crag.areaCount } </span></td>
                      <td><span>{ crag.tickCount }</span></td>
                      <td><span>{ crag.likeCount }</span></td>
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
