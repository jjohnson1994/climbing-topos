export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAreaBySlug } from '@/app/data/models/areas';
import { setAreaVerified, deleteArea } from '@/app/actions';
import ConfirmButton from '@/app/components/ConfirmButton';
import EditAreaForm from '@/app/components/EditAreaForm';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function AreaDetailPage({ params }: Props) {
  const { slug } = await params;
  const area = await getAreaBySlug(slug);

  if (!area) notFound();

  const hk = String(area.hk ?? '');
  const sk = String(area.sk ?? '');

  return (
    <>
      <div className="admin-topbar">
        <h2>
          <Link href="/areas" className="has-text-grey">Areas</Link>
          {' / '}
          {!!area.cragTitle && (
            <>
              <Link href={`/crags/${String(area.cragSlug ?? '')}`} className="has-text-grey">
                {String(area.cragTitle)}
              </Link>
              {' / '}
            </>
          )}
          {String(area.title ?? slug)}
        </h2>
        <div className="action-buttons">
          <ConfirmButton
            action={async () => {
              'use server';
              await setAreaVerified(hk, sk, slug, !area.verified);
            }}
            message={area.verified ? `Unverify area "${String(area.title)}"?` : `Verify area "${String(area.title)}"?`}
            className={`button is-small ${area.verified ? 'is-warning' : 'is-success'}`}
          >
            {area.verified ? 'Unverify' : 'Verify'}
          </ConfirmButton>
          <ConfirmButton
            action={async () => {
              'use server';
              await deleteArea(hk, sk);
            }}
            message={`Permanently delete area "${String(area.title)}"? This cannot be undone.`}
            className="button is-small is-danger is-outlined"
          >
            Delete Area
          </ConfirmButton>
        </div>
      </div>

      <div className="admin-content">
        <div className="columns">
          <div className="column is-two-thirds">
            <EditAreaForm hk={hk} sk={sk} slug={slug} area={area} />
          </div>

          <div className="column">
            <div className="detail-card">
              <h3>Metadata</h3>
              <dl>
                <div className="field-row">
                  <dt>Slug</dt>
                  <dd style={{ fontFamily: 'monospace' }}>{String(area.slug ?? slug)}</dd>
                </div>
                <div className="field-row">
                  <dt>Crag</dt>
                  <dd>
                    <Link href={`/crags/${String(area.cragSlug ?? '')}`}>
                      {String(area.cragTitle ?? '—')}
                    </Link>
                  </dd>
                </div>
                <div className="field-row">
                  <dt>Country</dt>
                  <dd>{String(area.country ?? '—')}</dd>
                </div>
                <div className="field-row">
                  <dt>County</dt>
                  <dd>{String(area.county ?? '—')}</dd>
                </div>
                <div className="field-row">
                  <dt>Verified</dt>
                  <dd>
                    <span className={`badge ${area.verified ? 'badge-success' : 'badge-warning'}`}>
                      {area.verified ? 'Yes' : 'No'}
                    </span>
                  </dd>
                </div>
                <div className="field-row">
                  <dt>Routes</dt>
                  <dd>{String(area.routeCount ?? 0)}</dd>
                </div>
                <div className="field-row">
                  <dt>Logs</dt>
                  <dd>{String(area.logCount ?? 0)}</dd>
                </div>
                <div className="field-row">
                  <dt>Created</dt>
                  <dd>{area.createdAt ? String(area.createdAt).slice(0, 10) : '—'}</dd>
                </div>
                <div className="field-row">
                  <dt>Created By</dt>
                  <dd>
                    {area.createdBy
                      ? String((area.createdBy as Record<string, unknown>).nickname ?? '—')
                      : '—'}
                  </dd>
                </div>
              </dl>
            </div>

            {Array.isArray(area.tags) && area.tags.length > 0 && (
              <div className="detail-card">
                <h3>Tags</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {(area.tags as string[]).map((tag) => (
                    <span key={tag} className="badge badge-info">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
