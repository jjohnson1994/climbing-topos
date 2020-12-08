import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import ButtonCopyCoordinates from "../../components/ButtonCopyCoordinates";
import CragQuickActions from "../../components/CragQuickActions";
import CragClimbsTable from "../../components/CragClimbsTable";
import { getCragBySlug } from "../../api/crags";
import { popupError } from "../../helpers/alerts";

type CragDescription = {
  access: string;
  accessDescription: string;
  accessLink: string;
  approachNotes: string;
  carParks: {
    title: string;
    latitude: string;
    longitude: string;
    description: string;
  }[];
  description: string;
  latitude: string;
  longitude: string;
  tags: string[];
  title: string;
  areas: {
    slug: string;
    title: string;
  }[];
}

function Crag() {
  const { cragSlug } = useParams<{ cragSlug: string }>();
  const [loading, setLoading] = useState(false);
  const [crag, setCrag] = useState<CragDescription | undefined>();
  const [activeTab, setActiveTab] = useState('routes');

  useEffect(() => {
    const doGetCrag = async () => {
      setLoading(true);

      try {
        const newCrag = await getCragBySlug(cragSlug);
        setCrag(newCrag);
      } catch (error) {
        console.error("Error loading crag", error);
        popupError("There was an error loading this crag. It's 90% your fault");
      } finally {
        setLoading(false);
      }
    };

    doGetCrag();
  }, []);


  return (
    <React.Fragment>
      <section className="section">
        <div className="container">
          <h1 className="title is-spaced is-capitalized">{ crag?.title }</h1>
          <h5 className="subtitle">{ crag?.description }</h5>
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
                <thead>
                  <tr>
                    <th>Title</th>
                  </tr>
                </thead>
                <tbody>
                  { crag?.areas?.map(area => (
                    <tr key={ area.slug }>
                      <td>
                        <Link
                          to={ `/crags/${cragSlug}/areas/${area.slug}` }
                          className="is-capitalized"
                        >
                          { area.title }
                        </Link>
                      </td>
                    </tr>
                  )) }
                </tbody>
              </table>
              <div className="buttons is-centered">
                <a className="button is-rounded" href={ `/crags/${cragSlug}/create-area` }>
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
                {(crag?.approachNotes &&
                  <p>{ crag?.approachNotes }</p>)
                  ||
                  <p>No approach details have been given. Hopefully that means it's an easy walk in 🤷‍♂️</p>
                }
              </div>
              <hr />
              <div className="block">
                <h3 className="title">Parking</h3>
                {crag?.carParks?.map((carPark, index) => (
                  <React.Fragment key={ index }>
                    <div className="is-flex">
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
                  </React.Fragment>
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
