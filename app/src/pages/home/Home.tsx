import { CragBrief } from 'core/types';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { crags } from '../../api';

function Home() {
  const [popularCrags, setPopularCrags] = useState<CragBrief[]>([]);

  useEffect(() => {
    crags
      .getCrags("", "logCount", "desc", 3)
      .then(popularCrags => {
        setPopularCrags(popularCrags)
      })
      .catch(error => {
        console.error(error)
      })
  }, [])

  return (
    <React.Fragment>
      <section className="section">
        <div className="container">
          <h1 className="title">Welcome to ClimbingTopos.com</h1>
          <h5 className="subtitle is-5">Made in Yorkshire</h5>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h1 className="title">Popular Crags</h1>
          <div className="columns">
            { popularCrags.map(crag => (
              <div className="column">
                <Link to={`/crags/${crag.slug}`}>
                  <div className="card">
                    <div className="card-image">
                      <figure className="image is-4by3">
                        <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder" />
                      </figure>
                    </div>
                    <div className="card-content">
                      <p className="title is-4">
                        { crag.title }
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

export default Home;
