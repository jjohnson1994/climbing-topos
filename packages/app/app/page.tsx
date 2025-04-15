import React from 'react';
import Link from 'next/link';
import { get as getCrags } from '@/app/data/actions/crags/get';
import Button, { Color } from './elements/Button';

export default async function Home() {
  const popularCrags = await getCrags(undefined, 'logCount', 'desc', 3).catch(
    (error) => console.error(error),
  );

  return (
    <>
      <section className="section">
        <div className="container">
          <h1 className="title">Welcome to ClimbingTopos.com</h1>
          <h5 className="subtitle is-5">Made in Yorkshire</h5>
        </div>
      </section>

      {popularCrags && (
        <section className="section">
          <div className="container">
            <h1 className="title">Popular</h1>
            <div className="columns">
              {popularCrags.map((crag) => (
                <div key={crag.slug} className="column">
                  <Link href={`/crags/${crag.slug}`}>
                    <div className="card">
                      <div className="card-image">
                        <figure className="image is-4by3">
                          <img
                            loading="lazy"
                            src={`${crag.image}`}
                            alt={crag.title}
                          />
                        </figure>
                      </div>
                      <div className="card-content">
                        <p className="title is-4">{crag.title}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            <div className="is-flex is-justified-end">
              <Link href="/crags">
                <Button>All Crags</Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
