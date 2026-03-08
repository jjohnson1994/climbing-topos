import { createFileRoute } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { getFn as getCragsFn } from '@/data/actions/crags/get';
// import { postHogClient } from '@/lib/posthog';
import Button, { Color } from '@/elements/Button';

export const Route = createFileRoute('/')({
  loader: async () => {
    const [popularCrags, showAboutSection, showRecentActivitySection] =
      await Promise.all([
        getCragsFn({
          data: { sortBy: 'logCount', sortOrder: 'DESC', limit: 3 },
        }).catch(() => null) as Promise<any[] | null>,
        // postHogClient
        //   .getFeatureFlagPayload('home-about-section', 'anonymous')
        //   .catch(() => null),
        // postHogClient
        //   .getFeatureFlagPayload('recent-activity', 'anonymous')
        //   .catch(() => null),
      ]);

    return { popularCrags, showAboutSection, showRecentActivitySection };
  },
  component: HomePage,
});

function HomePage() {
  const { popularCrags, showAboutSection, showRecentActivitySection } =
    Route.useLoaderData();

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
                <Link to="/crags/$cragSlug" params={{ cragSlug: crag.slug }}>
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
            <Link to="/crags">
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
              <p>ClimbingTopos.com is a community-driven climbing guide.</p>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
