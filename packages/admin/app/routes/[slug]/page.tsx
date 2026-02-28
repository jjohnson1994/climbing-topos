export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getRouteBySlug } from '@/app/data/models/routes';
import { setRouteVerified, deleteRoute } from '@/app/actions';
import ConfirmButton from '@/app/components/ConfirmButton';
import EditRouteForm from '@/app/components/EditRouteForm';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function RouteDetailPage({ params }: Props) {
  const { slug } = await params;
  const route = await getRouteBySlug(slug);

  if (!route) notFound();

  const hk = String(route.hk ?? '');
  const sk = String(route.sk ?? '');

  return (
    <>
      <div className="admin-topbar">
        <h2>
          <Link href="/routes" className="has-text-grey">Routes</Link>
          {' / '}
          {!!route.cragTitle && (
            <>
              <Link href={`/crags/${String(route.cragSlug ?? '')}`} className="has-text-grey">
                {String(route.cragTitle)}
              </Link>
              {' / '}
            </>
          )}
          {String(route.title ?? slug)}
        </h2>
        <div className="action-buttons">
          <ConfirmButton
            action={async () => {
              'use server';
              await setRouteVerified(hk, sk, slug, !route.verified);
            }}
            message={route.verified ? `Unverify route "${String(route.title)}"?` : `Verify route "${String(route.title)}"?`}
            className={`button is-small ${route.verified ? 'is-warning' : 'is-success'}`}
          >
            {route.verified ? 'Unverify' : 'Verify'}
          </ConfirmButton>
          <ConfirmButton
            action={async () => {
              'use server';
              await deleteRoute(hk, sk);
            }}
            message={`Permanently delete route "${String(route.title)}"? This cannot be undone.`}
            className="button is-small is-danger is-outlined"
          >
            Delete Route
          </ConfirmButton>
        </div>
      </div>

      <div className="admin-content">
        <div className="columns">
          <div className="column is-two-thirds">
            <EditRouteForm hk={hk} sk={sk} slug={slug} route={route} />
          </div>

          <div className="column">
            <div className="detail-card">
              <h3>Metadata</h3>
              <dl>
                <div className="field-row">
                  <dt>Slug</dt>
                  <dd style={{ fontFamily: 'monospace' }}>{String(route.slug ?? slug)}</dd>
                </div>
                <div className="field-row">
                  <dt>Crag</dt>
                  <dd>
                    <Link href={`/crags/${String(route.cragSlug ?? '')}`}>
                      {String(route.cragTitle ?? '—')}
                    </Link>
                  </dd>
                </div>
                <div className="field-row">
                  <dt>Area</dt>
                  <dd>
                    <Link href={`/areas/${String(route.areaSlug ?? '')}`}>
                      {String(route.areaTitle ?? '—')}
                    </Link>
                  </dd>
                </div>
                <div className="field-row">
                  <dt>Country</dt>
                  <dd>{String(route.country ?? '—')}</dd>
                </div>
                <div className="field-row">
                  <dt>Coordinates</dt>
                  <dd>
                    {route.latitude && route.longitude
                      ? `${String(route.latitude)}, ${String(route.longitude)}`
                      : '—'}
                  </dd>
                </div>
                <div className="field-row">
                  <dt>Verified</dt>
                  <dd>
                    <span className={`badge ${route.verified ? 'badge-success' : 'badge-warning'}`}>
                      {route.verified ? 'Yes' : 'No'}
                    </span>
                  </dd>
                </div>
                <div className="field-row">
                  <dt>Logs</dt>
                  <dd>{String(route.logCount ?? 0)}</dd>
                </div>
                <div className="field-row">
                  <dt>Rating</dt>
                  <dd>{route.rating ? `${Number(route.rating).toFixed(2)} / 5` : '—'}</dd>
                </div>
                <div className="field-row">
                  <dt>Created</dt>
                  <dd>{route.createdAt ? String(route.createdAt).slice(0, 10) : '—'}</dd>
                </div>
                <div className="field-row">
                  <dt>Created By</dt>
                  <dd>
                    {route.createdBy
                      ? String((route.createdBy as Record<string, unknown>).nickname ?? '—')
                      : '—'}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="detail-card">
              <h3>Tags</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {Array.isArray(route.tags) && route.tags.length > 0 ? (
                  (route.tags as string[]).map((tag) => (
                    <span key={tag} className="badge badge-info">{tag}</span>
                  ))
                ) : (
                  <span className="has-text-grey-light">No tags</span>
                )}
              </div>
            </div>

            {!!route.gradeTally && Object.keys(route.gradeTally as object).length > 0 && (
              <div className="detail-card">
                <h3>Grade Tally</h3>
                <dl>
                  {Object.entries(route.gradeTally as Record<string, unknown>).map(([k, v]) => (
                    <div className="field-row" key={k}>
                      <dt>{k}</dt>
                      <dd>{String(v)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
