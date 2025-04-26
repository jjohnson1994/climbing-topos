import React from 'react';
import Link from 'next/link';
import { get as getCrags } from '@/app/data/actions/crags/get';
import Button, { Color } from './elements/Button';
import { postHogClient } from './lib/posthog';

export default async function Home() {
  const popularCrags = await getCrags(undefined, 'logCount', 'DESC', 3).catch(
    (error) => console.error(error),
  );

  const [showAboutSection, showRecentActivitySection] = await Promise.all([
    postHogClient.getFeatureFlagPayload('home-about-section'),
    postHogClient.getFeatureFlagPayload('recent-activity'),
  ]);

  const cards = [
    {
      title: 'Card',
      content:
        'Aliquam in gravida eros. Nulla suscipit ex tempus, malesuada urna a.',
    },
    {
      title: 'Card',
      content:
        'Aliquam in gravida eros. Nulla suscipit ex tempus, malesuada urna a.',
    },
    {
      title: 'Card',
      content:
        'Aliquam in gravida eros. Nulla suscipit ex tempus, malesuada urna a.',
    },
  ];

  return (
    <>
      <section className="section">
        <div className="container">
          <h1 className="title">Welcome to ClimbingTopos.com</h1>
          <h5 className="subtitle is-5">Made in Yorkshire</h5>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h1 className="title">Popular</h1>
          <div className="columns">
            {popularCrags?.map((crag) => (
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

      {showAboutSection && (
        <section className="section">
          <div className="container">
            <h1 className="title">About</h1>
            <div className="block">
              <p>
                ClimbingTopos.com is a Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Aliquam in gravida eros. Nulla suscipit ex
                tempus, malesuada urna a, efficitur lorem. Fusce tellus tortor,
                pulvinar nec tortor eget, sollicitudin dictum est.{' '}
              </p>
            </div>
            <div className="columns">
              {cards.map((card) => (
                <div className="column">
                  <div className="card">
                    <div className="card-content">
                      <p className="title is-4">{card.title}</p>
                      <p> {card.content} </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {showRecentActivitySection && (
        <section className="section">
          <div className="container">
            <h1 className="title">Recent Activity</h1>
            <div className="block">
              <p></p>
            </div>

            <nav className="panel card">
              <a className="panel-block">
                <div className="level">
                  <div className="level-left">
                    <div className="level-item">
                      <span className="icon is-large">
                        <i
                          className="far fa-check-circle fa-lg"
                          aria-hidden="true"
                        ></i>
                      </span>
                    </div>
                    <div className="level-item">
                      <div>
                        <p className="title is-6">
                          James Wilson completed "Sunset Arete" (6a+) at Brimham
                          Rocks
                        </p>
                        <h6 className="subtitle is-6">2 hours ago</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
              <a className="panel-block">
                <span className="panel-icon">
                  <i className="fas fa-book" aria-hidden="true"></i>
                </span>
                marksheet
              </a>
              <a className="panel-block">
                <span className="panel-icon">
                  <i className="fas fa-book" aria-hidden="true"></i>
                </span>
                minireset.css
              </a>
              <a className="panel-block">
                <span className="panel-icon">
                  <i className="fas fa-book" aria-hidden="true"></i>
                </span>
                jgthms.github.io
              </a>
              <a className="panel-block">
                <span className="panel-icon">
                  <i className="fas fa-code-branch" aria-hidden="true"></i>
                </span>
                daniellowtw/infboard
              </a>
              <a className="panel-block">
                <span className="panel-icon">
                  <i className="fas fa-code-branch" aria-hidden="true"></i>
                </span>
                mojs
              </a>
            </nav>
          </div>
        </section>
      )}
    </>
  );
}
