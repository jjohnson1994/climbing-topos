import Link from 'next/link';
import { Area, Crag, Topo } from '@climbingtopos/types';
import { get as getCrags } from '@/app/data/actions/crags/get';
import AreaRoutesTable from '@/app/components/AreaRoutesTable';
import ButtonCopyCoordinates from '@/app/components/ButtonCopyCoordinates';
import CragMap from '@/app/components/CragMap';
import TopoImage from '@/app/components/TopoImage';
import CragTitleImage from '@/app/components/CragTitleImage';
import CragAdmin from '@/app/components/CragAdmin';
import { Auth } from 'aws-amplify';
import Head from 'next/head';
import { auth } from '@/app/actions';

async function CragView({
  params,
  searchParams,
}: {
  params: { cragSlug: string };
  searchParams: { tab?: string };
}) {
  const user = await auth();

  const { cragSlug } = params;

  let crag: Crag;
  let activeTab = '';
  let isAdmin = false;

  const doGetCrag = async () => {
    try {
      const newCrag = await getCrags(cragSlug);
      crag = newCrag;

      if (crag.routes.length) {
        activeTab = 'guide';
      } else {
        activeTab = 'routes';
      }

      if (searchParams.tab) {
        activeTab = searchParams.tab;
      }
    } catch (error) {
      console.error('Error loading crag', error);
      // TODO error page
    }
  };

  const doGetUser = async () => {
    try {
      const credentials = await Auth.currentCredentials();
    } catch (error) {
      console.error('error getting user', error);
    }
  };

  await doGetCrag();
  await doGetUser();

  if (crag?.managedBy.sub && crag?.managedBy.sub === user.id) {
    isAdmin = true;
    // TODO match new user ids with crag managed by
  }

  const areaTopos = (area: Area) => {
    return crag?.topos.filter((topo) => topo.areaSlug === area.slug);
  };

  const topoRoutes = (topo: Topo) => {
    return crag?.routes.filter((route) => route.topoSlug === topo.slug) || [];
  };

  return (
    <>
      <Head>
        <title>{crag.title} | ClimbingTopos.com</title>
        <link
          rel="canonical"
          href={`https://climbingtopos.com/crags/${crag.slug}`}
        />
        <meta
          name="description"
          content={`${crag.title} climbing guide and topo`}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`${crag.title} | ClimbingTopos.com`}
        />
        <meta
          property="og:url"
          content={`https://climbingtopos.com/crags/${crag.slug}`}
        />
        <meta
          property="og:description"
          content={`${crag.title} climbing guide and topo`}
        />
        <meta property="og:image" content={`${crag.image}`} />
      </Head>
      <div className="columns is-gapless mb-0">
        <div className="column">
          <CragTitleImage src={`${crag.image}`} />
        </div>
        <div className="column">
          <section className="section">
            {crag.access === 'banned' && (
              <div className="notification is-danger">
                Climbing at this crag is <b>banned</b>, probably best to find
                somewhere else
              </div>
            )}
            <div className="container">
              <h1 className="title is-spaced is-capitalized">{crag?.title}</h1>
              <h5 className="subtitle is-5">{crag?.description}</h5>
              <div role="group" className="tags">
                {isAdmin === true && (
                  <label className="tag is-capitalized is-warning">Admin</label>
                )}
                <label
                  className={`tag is-capitalized ${crag?.access === 'banned' ? 'is-danger ' : 'is-primary'
                    }`}
                >
                  Access {crag?.access}
                </label>
                {crag?.tags?.map((tag) => (
                  <label key={tag} className="tag is-primary">
                    {tag}
                  </label>
                ))}
              </div>
              <div className="buttons is-right">
                <ButtonCopyCoordinates
                  latitude={`${crag?.latitude}`}
                  longitude={`${crag?.longitude}`}
                />
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="tabs mb-0">
        <ul>
          {crag?.routes.length ? (
            <li className={activeTab === 'guide' ? 'is-active' : ''}>
              <Link href="?tab=guide">Guide</Link>
            </li>
          ) : (
            ''
          )}
          <li className={activeTab === 'routes' ? 'is-active' : ''}>
            <Link href="?tab=routes">Routes</Link>
          </li>
          <li className={activeTab === 'areas' ? 'is-active' : ''}>
            <Link href="?tab=areas">Areas</Link>
          </li>
          <li className={activeTab === 'approach' ? 'is-active' : ''}>
            <Link href="?tab=approach">Approach</Link>
          </li>
          <li className={activeTab === 'map' ? 'is-active' : ''}>
            <Link href="?tab=map">Map</Link>
          </li>
          {isAdmin === true && (
            <li className={activeTab === 'admin' ? 'is-active' : ''}>
              <Link href="?tab=admin">Admin</Link>
            </li>
          )}
        </ul>
      </div>

      <section className="section">
        {activeTab === 'guide' &&
          crag?.areas?.map((area) => (
            <div key={area.slug} className="container">
              <div className="block">
                <div className="columns">
                  <div className="column is-two-thirds">
                    <Link href={`/crags/${area.cragSlug}/areas/${area.slug}`}>
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
                      className={`columns ${topoRoutes(topo).length ? '' : 'is-hidden'
                        }`}
                    >
                      <div className="column">
                        <TopoImage
                          routes={topoRoutes(topo)}
                          background={String(topo.image)}
                        />
                      </div>
                      <div className="column">
                        <div className="is-flex is-justify-content-flex-end">
                          <span className="icon-text">
                            <span className="icon">
                              <i className="fas fa-compass"></i>
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
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <hr />
            </div>
          ))}

        {activeTab === 'routes' && (
          <div id="routes" className="container">
            {crag?.routes.length ? (
              <AreaRoutesTable
                routes={crag?.routes}
                loggedRoutes={(crag && crag.userLogs) || []}
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
        )}
        {activeTab === 'routes' && crag?.routes.length ? (
          <p className="has-text-centered">
            <b>Hint: </b>New routes can be added from an <b>areas</b> page
          </p>
        ) : (
          ''
        )}

        {activeTab === 'areas' && (
          <div id="areas" className="container box">
            {crag?.areas.length ? (
              <table className="table is-fullwidth">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Routes</th>
                    <th>Logs</th>
                  </tr>
                </thead>
                <tbody>
                  {crag?.areas?.map((area) => (
                    <tr key={area.slug}>
                      <td>
                        <Link
                          href={`/crags/${cragSlug}/areas/${area.slug}`}
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
              <a
                className="button is-rounded"
                href={`/crags/${cragSlug}/create-area`}
              >
                <span className="icon is-small">
                  <i className="fas fa-plus"></i>
                </span>
                <span>Add Area</span>
              </a>
            </div>
          </div>
        )}

        {activeTab === 'approach' && (
          <div id="approach" className="container">
            <div className="box">
              <h3 className="title">Approach</h3>
              {(crag?.approachNotes && <p>{crag?.approachNotes}</p>) || (
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
                  {crag?.access}
                </span>
              </h3>
              {crag?.accessDetails && <p>{crag.accessDetails}</p>}
              {crag?.accessLink && <p>{crag.accessLink}</p>}
            </div>
          </div>
        )}

        {activeTab === 'map' && crag && <CragMap crag={crag} />}

        {activeTab === 'admin' && crag && <CragAdmin crag={crag} />}
      </section>
    </>
  );
}

export default CragView;
