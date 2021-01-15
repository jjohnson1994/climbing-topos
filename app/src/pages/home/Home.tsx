import React from 'react';

function Home() {
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
            <div className="column">
              <div className="card">
                <div className="card-image">
                  <figure className="image is-4by3">
                    <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder" />
                  </figure>
                </div>
              </div>
            </div>
            <div className="column">
              <div className="card">
                <div className="card-image">
                  <figure className="image is-4by3">
                    <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder" />
                  </figure>
                </div>
              </div>
            </div>
            <div className="column">
              <div className="card">
                <div className="card-image">
                  <figure className="image is-4by3">
                    <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder" />
                  </figure>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

export default Home;
