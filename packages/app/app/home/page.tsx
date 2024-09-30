import React  from 'react';
import Link from 'next/link';
import { crags } from '@/app/api';

export default async function Home() {
  const popularCrags = await crags
    .getCrags('logCount', 'desc', 3)
    .catch(error => {
      console.error(error)
    })

  return (
    <React.Fragment>
      <section className="section">
        <div className="container">
          <h1 className="title">Welcome to ClimbingTopos.com</h1>
          <h5 className="subtitle is-5">Made in Yorkshire</h5>
        </div>
      </section>

      { popularCrags?.length && (
        <section className="section">
          <div className="container">
            <h1 className="title">Popular Crags</h1>
            <div className="columns">
              { popularCrags.map(crag => (
                <div key={ crag.slug } className="column">
                  <Link href={`/crags/${crag.slug}`}>
                    <div className="card">
                      <div className="card-image">
                        <figure className="image is-4by3">
                          <img loading="lazy" src={ `${crag.image_url}` } alt={ crag.title } />
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
      )}
    </React.Fragment>
  );
}
