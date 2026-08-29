import { createFileRoute, Link } from '@tanstack/react-router';
import { Suspense, lazy } from 'react';
import { Area, Crag, Topo } from '@climbingtopos/types';
import { getFn as getCragFn } from '@/data/actions/crags/get';
import AreaRoutesTable from '@/components/AreaRoutesTable';
import CragRoutesTable from '@/components/CragRoutesTable';
import ButtonCopyCoordinates from '@/components/ButtonCopyCoordinates';
import ButtonSaveOffline from '@/components/ButtonSaveOffline';
import TopoImage from '@/components/TopoImage';
import CragTitleImage from '@/components/CragTitleImage';
import CragAdmin from '@/components/CragAdmin';
import CragStats from '@/components/CragStats';
import { logError } from '@/lib/log';
import { getOfflineCrag } from '@/lib/offline/crags';

const CragMap = lazy(() => import('@/components/CragMapClient'));

export const Route = createFileRoute('/crags/$cragSlug/')({
  validateSearch: (search: Record<string, unknown>): { tab?: string } => ({
    tab: search.tab as string | undefined,
  }),
  loader: async ({ params, context }) => {
    let crag: Crag;
    let isOfflineCopy = false;
    try {
      crag = (await getCragFn({
        data: { cragSlug: params.cragSlug },
      })) as unknown as Crag;
    } catch (err) {
      const offlineCrag =
        typeof window !== 'undefined'
          ? await getOfflineCrag(params.cragSlug)
          : undefined;
      if (!offlineCrag) {
        logError('loader:crag', err, { cragSlug: params.cragSlug });
        throw err;
      }
      crag = offlineCrag;
      isOfflineCopy = true;
    }

    const user = context.user;
    const userSub = user ? user.properties.sub : undefined;
    const isAdmin = !!(crag?.managedBy?.sub && crag.managedBy.sub === userSub);

    let activeTab = '';
    if (crag?.routes?.length) {
      activeTab = 'guide';
    } else {
      activeTab = 'routes';
    }

    return {
      crag,
      isAdmin,
      isAuthenticated: !!user,
      defaultTab: activeTab,
      isOfflineCopy,
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.crag) return { meta: [], links: [] };
    const { crag } = loaderData;
    const canonicalUrl = `https://climbingtopos.com/crags/${crag.slug}`;
    const descriptionParts = [crag.description];
    if (crag.routeCount) descriptionParts.push(`${crag.routeCount} routes`);
    if (crag.areaCount) descriptionParts.push(`${crag.areaCount} areas`);
    if (crag.tags?.length) descriptionParts.push(crag.tags.join(', '));
    descriptionParts.push(`${crag.title} climbing guide with topos and route information.`);
    const description = descriptionParts.filter(Boolean).join('. ');
    const jsonLd = [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Crags',
            item: 'https://climbingtopos.com/crags',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: crag.title,
            item: canonicalUrl,
          },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': ['TouristAttraction', 'SportsActivityLocation'],
        name: crag.title,
        description: crag.description || undefined,
        url: canonicalUrl,
        image: crag.image || undefined,
        sport: 'Rock Climbing',
        ...(crag.latitude && crag.longitude
          ? {
              geo: {
                '@type': 'GeoCoordinates',
                latitude: parseFloat(crag.latitude),
                longitude: parseFloat(crag.longitude),
              },
            }
          : {}),
        additionalProperty: [
          crag.routeCount
            ? { '@type': 'PropertyValue', name: 'routeCount', value: crag.routeCount }
            : null,
          crag.areaCount
            ? { '@type': 'PropertyValue', name: 'areaCount', value: crag.areaCount }
            : null,
        ].filter(Boolean),
      },
    ];
    return {
      meta: [
        { title: `${crag.title} | ClimbingTopos.com` },
        { name: 'description', content: description },
        ...(crag.latitude && crag.longitude
          ? [
              { name: 'geo.position', content: `${crag.latitude};${crag.longitude}` },
              { name: 'ICBM', content: `${crag.latitude}, ${crag.longitude}` },
              { name: 'geo.placename', content: crag.title },
            ]
          : []),
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: `${crag.title} | ClimbingTopos.com` },
        { property: 'og:description', content: description },
        { property: 'og:url', content: canonicalUrl },
        { property: 'og:image', content: crag.image as string },
        { 'script:ld+json': jsonLd },
      ],
      links: [{ rel: 'canonical', href: canonicalUrl }],
    };
  },
  component: CragPage,
});

function CragPage() {
  const { crag, isAdmin, isAuthenticated, defaultTab, isOfflineCopy } =
    Route.useLoaderData();
  const search = Route.useSearch();
  const { cragSlug } = Route.useParams();
  const activeTab = search.tab || defaultTab;

  if (!crag) return null;

  const areaTopos = (area: Area) => {
    return crag.topos.filter((topo) => topo.areaSlug === area.slug);
  };

  const topoRoutes = (topo: Topo) => {
    return crag.routes.filter((route) => route.topoSlug === topo.slug) || [];
  };

  return (
    <>
      <div className="columns is-gapless mb-0">
        <div className="column">
          <CragTitleImage src={`${crag.image}`} cragTitle={crag.title} />
        </div>
        <div className="column">
          <section className="section">
            {isOfflineCopy && (
              <div className="notification is-info">
                You&apos;re offline — showing the last copy of this crag you
                saved for offline viewing
              </div>
            )}
            {crag.access === 'banned' && (
              <div className="notification is-danger">
                Climbing at this crag is <b>banned</b>, probably best to find
                somewhere else
              </div>
            )}
            <div className="container">
              <h1 className="title is-spaced is-capitalized">{crag.title}</h1>
              <h5 className="subtitle is-5">{crag.description}</h5>
              <div role="group" className="tags">
                {isAdmin === true && (
                  <label className="tag is-capitalized is-warning">Admin</label>
                )}
                <label
                  className={`tag is-capitalized ${crag.access === 'banned' ? 'is-danger ' : 'is-primary'}`}
                >
                  Access {crag.access}
                </label>
                {crag.tags?.map((tag) => (
                  <label key={tag} className="tag is-primary">
                    {tag}
                  </label>
                ))}
              </div>
              <div className="buttons is-right">
                <ButtonCopyCoordinates
                  latitude={`${crag.latitude}`}
                  longitude={`${crag.longitude}`}
                />
                <ButtonSaveOffline crag={crag} />
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="tabs mb-0">
        <ul>
          {crag.routes.length ? (
            <li className={activeTab === 'guide' ? 'is-active' : ''}>
              <Link
                to="/crags/$cragSlug"
                params={{ cragSlug }}
                search={{ tab: 'guide' }}
                resetScroll={false}
              >
                Guide
              </Link>
            </li>
          ) : null}
          <li className={activeTab === 'routes' ? 'is-active' : ''}>
            <Link
              to="/crags/$cragSlug"
              params={{ cragSlug }}
              search={{ tab: 'routes' }}
              resetScroll={false}
            >
              Routes
            </Link>
          </li>
          <li className={activeTab === 'areas' ? 'is-active' : ''}>
            <Link
              to="/crags/$cragSlug"
              params={{ cragSlug }}
              search={{ tab: 'areas' }}
              resetScroll={false}
            >
              Areas
            </Link>
          </li>
          <li className={activeTab === 'approach' ? 'is-active' : ''}>
            <Link
              to="/crags/$cragSlug"
              params={{ cragSlug }}
              search={{ tab: 'approach' }}
              resetScroll={false}
            >
              Approach
            </Link>
          </li>
          <li className={activeTab === 'map' ? 'is-active' : ''}>
            <Link
              to="/crags/$cragSlug"
              params={{ cragSlug }}
              search={{ tab: 'map' }}
              resetScroll={false}
            >
              Map
            </Link>
          </li>
          <li className={activeTab === 'stats' ? 'is-active' : ''}>
            <Link
              to="/crags/$cragSlug"
              params={{ cragSlug }}
              search={{ tab: 'stats' }}
              resetScroll={false}
            >
              Stats
            </Link>
          </li>
          {isAdmin === true && (
            <li className={activeTab === 'admin' ? 'is-active' : ''}>
              <Link
                to="/crags/$cragSlug"
                params={{ cragSlug }}
                search={{ tab: 'admin' }}
                resetScroll={false}
              >
                Admin
              </Link>
            </li>
          )}
        </ul>
      </div>

      <section className="section">
        <div className={activeTab !== 'guide' ? 'is-hidden' : ''}>
          {crag.areas?.map((area) => (
            <div key={area.slug} className="container">
              <div className="block">
                <div className="columns">
                  <div className="column is-two-thirds">
                    <Link
                      to="/crags/$cragSlug/areas/$areaSlug"
                      params={{ cragSlug: area.cragSlug, areaSlug: area.slug }}
                    >
                      <h1 className="title" style={{ whiteSpace: 'nowrap' }}>
                        {area.title}
                      </h1>
                    </Link>
                    <p className="subtitle is-6">{area.description}</p>
                  </div>
                  <div className="column">
                    <div className="tags">
                      {area.verified !== true && (
                        <span className="tag is-info">Not Verified</span>
                      )}
                      {area.tags.map((tag) => (
                        <label key={tag} className="tag">
                          {tag}
                        </label>
                      ))}
                    </div>
                    <div className="buttons is-right">
                      <ButtonCopyCoordinates
                        latitude={area.latitude}
                        longitude={area.longitude}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="block">
                {areaTopos(area)
                  ?.filter((topo) => topo.areaSlug === area.slug)
                  .map((topo) => (
                    <div
                      key={topo.slug}
                      className={`columns ${topoRoutes(topo).length ? '' : 'is-hidden'}`}
                    >
                      <div className="column is-sticky is-top">
                        <TopoImage
                          routes={topoRoutes(topo)}
                          background={String(topo.image)}
                        />
                      </div>
                      <div className="column">
                        <div className="is-flex is-justify-content-flex-end">
                          <span className="icon-text">
                            <span className="icon">
                              <i className="fas fa-compass" aria-hidden="true"></i>
                            </span>
                            <span className="is-capitalized">
                              {topo.orientation}
                            </span>
                          </span>
                          {topo.verified !== true && (
                            <span className="ml-2 tag is-info">
                              Not Verified
                            </span>
                          )}
                        </div>
                        <div className="mt-1">
                          <AreaRoutesTable
                            routes={topoRoutes(topo)}
                            loggedRoutes={crag.userLogs}
                            isAuthenticated={isAuthenticated}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <hr />
            </div>
          ))}
        </div>

        <div className={activeTab !== 'routes' ? 'is-hidden' : ''}>
          <div id="routes" className="container">
            {crag.routes.length ? (
              <CragRoutesTable
                routes={crag.routes}
                loggedRoutes={(crag && crag.userLogs) || []}
                isAuthenticated={isAuthenticated}
              />
            ) : (
              <p className="box">
                <b>This crag doesn't have any routes yet</b>
                <br />
                To start adding routes: you must first create an area, then
                upload a topo image
              </p>
            )}
          </div>
          {crag.routes.length ? (
            <p className="has-text-centered mt-2">
              <b>Hint: </b>New routes can be added from an <b>areas</b> page
            </p>
          ) : null}
        </div>

        <div id="areas" className={`container box ${activeTab !== 'areas' ? 'is-hidden' : ''}`}>
          {crag.areas.length ? (
            <table className="table is-fullwidth">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Routes</th>
                  <th>Logs</th>
                </tr>
              </thead>
              <tbody>
                {crag.areas?.map((area) => (
                  <tr key={area.slug}>
                    <td>
                      <Link
                        to="/crags/$cragSlug/areas/$areaSlug"
                        params={{ cragSlug, areaSlug: area.slug }}
                        className="is-capitalized"
                      >
                        {area.title}
                      </Link>
                    </td>
                    <td>{area.routeCount}</td>
                    <td>{area.logCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>
              <b>This crag doesn't have any areas yet</b>
              <br />
              Click below to start adding one
            </p>
          )}
          <div className="buttons is-centered">
            <Link
              to="/crags/$cragSlug/create-area"
              params={{ cragSlug }}
              className="button is-rounded"
            >
              <span className="icon is-small">
                <i className="fas fa-plus" aria-hidden="true"></i>
              </span>
              <span>Add Area</span>
            </Link>
          </div>
        </div>

        <div id="approach" className={`container ${activeTab !== 'approach' ? 'is-hidden' : ''}`}>
          <div className="box">
            <h3 className="title">Approach</h3>
            {(crag.approachNotes && <p>{crag.approachNotes}</p>) || (
              <p>
                No approach details have been given. Hopefully that means it's
                an easy walk in 🤷‍♂️
              </p>
            )}
          </div>
          <div className="box">
            <h3 className="title">
              Access
              <span className="ml-1"></span>
              <span className="tag is-primary is-capitalized">
                {crag.access}
              </span>
            </h3>
            {crag.accessDetails && <p>{crag.accessDetails}</p>}
            {crag.accessLink && <p>{crag.accessLink}</p>}
          </div>
        </div>

        {activeTab === 'map' && crag && (
          <Suspense fallback={<div />}>
            <CragMap crag={crag} />
          </Suspense>
        )}

        <div className={`container ${activeTab !== 'stats' ? 'is-hidden' : ''}`}>
          <CragStats crag={crag} />
        </div>

        {activeTab === 'admin' && crag && <CragAdmin crag={crag} />}
      </section>
    </>
  );
}
