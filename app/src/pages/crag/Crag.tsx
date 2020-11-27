import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";

import ButtonCopyCoordinates from "../../components/ButtonCopyCoordinates";
import CragQuickActions from "../../components/CragQuickActions";
import CragClimbsTable from "../../components/CragClimbsTable";

function Crag() {
  const { slug } = useParams<{ slug: string }>();
  const [crag, setCrag] = useState({
    details: {
      title: '',
      description: '',
      approachNotes: ''
    },
    areas: [{
      slug: '',
      title: ''
    }],
    carParks: [
      {
        id: '',
        title: '',
        latitude: '',
        longitude: '',
        description: ''
      }
    ]
  });
  const [activeTab, setActiveTab] = useState('routs');

  return (
    <React.Fragment>
      <section className="section">
        <div className="container">
          <h1 className="title is-spaced is-capitalized">{ crag.details.title }</h1>
          <h5 className="subtitle">{ crag.details.description }</h5>
          <CragQuickActions crag={ crag } /> 
        </div>
      </section>

      <section className="section">
        <div className="tabs">
          <ul>
            <li className={ activeTab === 'routes' ? 'is-active' : '' }>
              <a onClick={ () => setActiveTab('routes') }>Routes</a>
            </li>
            <li className={ activeTab === 'areas' ? 'is-active' : '' }>
              <a onClick={ () => setActiveTab('areas') }>Areas</a>
            </li>
            <li className={ activeTab === 'approach' ? 'is-active' : '' }>
              <a onClick={ () => setActiveTab('approach') }>Approach</a>
            </li>
            <li className={ activeTab === 'map' ? 'is-active' : '' }>
              <a onClick={ () => setActiveTab('map') }>Map</a>
            </li>
          </ul>
        </div>
        <div className="container">
          <div className="box">
            <div
              id="routes"
              className={`
                tab-content
                ${activeTab !== 'routes' ? 'is-hidden' : '' }
              `}
            >
              <CragClimbsTable />
            </div>
          
            <div
              id="areas"
              className={`
                tab-content
                ${activeTab !== 'areas' ? 'is-hidden' : ''}
              `}
            >
              <table className="table is-fullwidth">
                <tr>
                  <th>Title</th>
                </tr>
                { crag.areas.map(area => (
                  <tr key={ area.slug }>
                    <td>
                      <Link
                        rel='prefetch'
                        to='/crags/{crag.details.slug}/areas/{area.slug}'
                        className="is-capitalized"
                      >
                        { area.title }
                      </Link>
                    </td>
                  </tr>
                )) }
              </table>
              <div className="buttons is-centered">
                <a className="button is-rounded" href="{$page.path}/create-area">
                  <span className="icon is-small">
                    <i className="fas fa-plus"></i>
                  </span>
                  <span>Add Area</span>
                </a>
              </div>
            </div>

            <div
              id="approach"
              className={`
                tab-content
                ${activeTab !== 'approach' ? 'is-hidden' : ''}
              `}>
              <div className="block">
                <h3 className="title">Approach</h3>
                {(crag.details.approachNotes &&
                  <p>{ crag.details.approachNotes }</p>)
                  ||
                  <p>No approach details have been given. Hopefully that means it's an easy walk in 🤷‍♂️</p>
                }
              </div>
              <hr />
              <div className="block">
                <h3 className="title">Parking</h3>
                {crag.carParks.map(carPark => (
                  <>
                    <div key={ carPark.id } className="is-flex">
                      <h4 className="title is-4 is-capitalized">{ carPark.title }</h4>
                      <span className="ml-2"></span>
                      <ButtonCopyCoordinates
                        latitude={ carPark.latitude }
                        longitude={ carPark.longitude }
                      />
                    </div>
                    <p className={ carPark.description ? 'm-4' : '' }>
                      { carPark.description ? carPark.description : '' }
                    </p>
                  </>
                ))}
              </div>
            </div>

            <div
              id="map"
              className={`
                tab-content
                ${activeTab !== 'map' ? 'is-hidden' : ''}
              `}
            >
              <div id="map"></div>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};

export default Crag;
