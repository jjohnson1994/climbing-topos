import React, { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from 'react-router-dom';

import CragQuickActions from "../../components/CragQuickActions";
import { getCrags } from "../../api/crags";
import {Crag} from '../../../../core/types';

function Crags() {
  const [crags, setCrags] = useState<Crag[]>([]);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    doGetCrags();
  }, []);

  async function doGetCrags() {
    try {
      const crags = await getCrags()
      setCrags(crags.Items);
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
