import { createFileRoute, Link } from '@tanstack/react-router';
import type { Area, Crag } from '@climbingtopos/types';
import { getFn as getAreaFn } from '@/data/actions/areas/get';
import { getFn as getCragFn } from '@/data/actions/crags/get';
import { logError } from '@/lib/log';
import AreaRoutesTable from '@/components/AreaRoutesTable';
import ButtonCopyCoordinates from '@/components/ButtonCopyCoordinates';
import TopoImage from '@/components/TopoImage';

export const Route = createFileRoute('/crags/$cragSlug/areas/$areaSlug/')({
  loader: async ({ params, context }) => {
    try {
      const [area, crag] = await Promise.all([
        getAreaFn({ data: { areaSlug: params.areaSlug } }),
        getCragFn({ data: { cragSlug: params.cragSlug } }),
      ]);
      return {
        area: area as unknown as Area,
        crag: crag as unknown as Crag | null,
        isAuthenticated: !!context.user,
      };
    } catch (err) {
      logError('loader:area', err, { cragSlug: params.cragSlug, areaSlug: params.areaSlug })
      throw err
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData?.area) return { meta: [], links: [] };
    const { area, crag } = loaderData;
    const canonicalUrl = `https://climbingtopos.com/crags/${area.cragSlug}/areas/${area.slug}`;
    const description = [
      area.description,
      `${area.title} climbing area at ${area.cragTitle}. Routes, topos, and climbing guide.`,
    ]
      .filter(Boolean)
      .join(' ');
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: area.cragTitle,
          item: `https://climbingtopos.com/crags/${area.cragSlug}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: area.title,
          item: canonicalUrl,
        },
      ],
    };
    return {
      meta: [
        {
          title: `${area.title} | ${area.cragTitle} | ClimbingTopos.com`,
        },
        { name: 'description', content: description },
        { property: 'og:type', content: 'website' },
        {
          property: 'og:title',
          content: `${area.title} | ${area.cragTitle} | ClimbingTopos.com`,
        },
        { property: 'og:description', content: description },
        { property: 'og:url', content: canonicalUrl },
        { property: 'og:image', content: crag?.image as string },
        { 'script:ld+json': jsonLd },
      ],
      links: [{ rel: 'canonical', href: canonicalUrl }],
    };
  },
  component: AreaPage,
});

function AreaPage() {
  const { area, crag, isAuthenticated } = Route.useLoaderData();
  const { cragSlug, areaSlug } = Route.useParams();

  if (!area) return null;

  return (
    <>
      <section className="section pt-5">
        <div className="container">
          <nav className="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li>
                <Link
                  to="/crags/$cragSlug"
                  params={{ cragSlug: area.cragSlug }}
                >
                  {area.cragTitle}
                </Link>
              </li>
            </ul>
          </nav>
          <div className="columns">
            <div className="column is-two-thirds">
              <h1 className="title is-spaced is-capitalized">{area.title}</h1>
              <h6 className="subtitle is-6">{area.description}</h6>
              <h6 className="subtitle is-6">{area.approachNotes}</h6>
              <h6 className="subtitle is-6">{area.accessDetails}</h6>
            </div>
            <div className="column">
              <div role="group" className="tags">
                {area.verified === false && (
                  <span className="tag is-info">Awaiting Verification</span>
                )}
                <span
                  className={`tag is-capitalized ${area.access === 'banned' ? 'is-danger ' : ''}`}
                >
                  Access {area.access}
                </span>
                {area.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="buttons has-addons is-right">
                <ButtonCopyCoordinates
                  latitude={`${area.latitude}`}
                  longitude={`${area.longitude}`}
                />
                <Link
                  to="/crags/$cragSlug/create-topo/$areaSlug"
                  params={{ cragSlug, areaSlug }}
                  className="button is-rounded"
                >
                  <span className="icon is-small">
                    <i className="fas fa-plus"></i>
                  </span>
                  <span>Add Topo</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {area.topos.length ? (
        <section className="section">
          {area.topos &&
            area.topos.map((topo) => (
              <div key={topo.slug} id={topo.slug} className="container block">
                <div className="columns">
                  <div className="column is-sticky is-top">
                    <TopoImage
                      routes={area.routes?.filter(
                        (route) => route.topoSlug === topo.slug,
                      )}
                      background={`${topo.image}`}
                    />
                  </div>
                  <div className="column">
                    <div className="block is-flex is-justify-content-space-between is-align-items-center">
                      <span>
                        <span className="icon-text">
                          <span className="icon">
                            <i className="fas fa-compass"></i>
                          </span>
                          <span className="is-capitalized">
                            {topo.orientation}
                          </span>
                        </span>
                      </span>
                      <Link
                        to="/crags/$cragSlug/areas/$areaSlug/topos/$topoSlug/create-route"
                        params={{ cragSlug, areaSlug, topoSlug: topo.slug! }}
                        className="button is-rounded"
                      >
                        <span className="icon is-small">
                          <i className="fas fa-plus"></i>
                        </span>
                        <span>Add Route</span>
                      </Link>
                    </div>
                    {area.routes?.filter(
                      (route) => route.topoSlug === topo.slug,
                    ).length ? (
                      <div className="block">
                        <AreaRoutesTable
                          routes={area.routes?.filter(
                            (route) => route.topoSlug === topo.slug,
                          )}
                          loggedRoutes={area.userLogs}
                          isAuthenticated={isAuthenticated}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
        </section>
      ) : null}

      {area.topos.length === 0 ? (
        <section className="section">
          <div className="container box">
            <p>
              <b>There's nothing here... YET!</b>
              <br />
              Click "Add Topo" above to start uploading images and drawing
              routes
            </p>
          </div>
        </section>
      ) : null}
    </>
  );
}
