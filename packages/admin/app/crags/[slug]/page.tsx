export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCragBySlug } from '@/app/data/models/crags';
import { getAreasByCrag } from '@/app/data/models/areas';
import { getRoutesByCrag } from '@/app/data/models/routes';
import { setCragVerified, deleteCrag, setAreaVerified, setRouteVerified } from '@/app/actions';
import ConfirmButton from '@/app/components/ConfirmButton';
import EditCragForm from '@/app/components/EditCragForm';
import CragImageUpload from '@/app/components/CragImageUpload';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CragDetailPage({ params }: Props) {
  const { slug } = await params;
  const [crag, areas, routes] = await Promise.all([
    getCragBySlug(slug),
    getAreasByCrag(slug),
    getRoutesByCrag(slug),
  ]);

  if (!crag) notFound();

  return (
    <>
      <div className="admin-topbar">
        <h2>
          <Link href="/crags" className="has-text-grey">Crags</Link>
          {' / '}
          {String(crag.title ?? slug)}
        </h2>
        <div className="action-buttons">
          <ConfirmButton
            action={async () => {
              'use server';
              await setCragVerified(slug, !crag.verified);
            }}
            message={crag.verified ? `Unverify crag "${String(crag.title)}"?` : `Verify crag "${String(crag.title)}"?`}
            className={`button is-small ${crag.verified ? 'is-warning' : 'is-success'}`}
          >
            {crag.verified ? 'Unverify' : 'Verify'}
          </ConfirmButton>
          <ConfirmButton
            action={async () => {
              'use server';
              await deleteCrag(slug);
            }}
            message={`Permanently delete crag "${String(crag.title)}"? This cannot be undone.`}
            className="button is-small is-danger is-outlined"
          >
            Delete Crag
          </ConfirmButton>
        </div>
      </div>

      <div className="admin-content">
        <div className="columns">
          <div className="column is-two-thirds">
            <EditCragForm slug={slug} crag={crag} />
          </div>

          <div className="column">
            <div className="detail-card">
              <h3>Metadata</h3>
              <dl>
                <div className="field-row">
                  <dt>Slug</dt>
                  <dd style={{ fontFamily: 'monospace' }}>{String(crag.slug ?? slug)}</dd>
                </div>
                <div className="field-row">
                  <dt>Country</dt>
                  <dd>{String(crag.country ?? '—')}</dd>
                </div>
                <div className="field-row">
                  <dt>County</dt>
                  <dd>{String(crag.county ?? '—')}</dd>
                </div>
                <div className="field-row">
                  <dt>State</dt>
                  <dd>{String(crag.state ?? '—')}</dd>
                </div>
                <div className="field-row">
                  <dt>Verified</dt>
                  <dd>
                    <span className={`badge ${crag.verified ? 'badge-success' : 'badge-warning'}`}>
                      {crag.verified ? 'Yes' : 'No'}
                    </span>
                  </dd>
                </div>
                <div className="field-row">
                  <dt>Areas</dt>
                  <dd>{String(crag.areaCount ?? 0)}</dd>
                </div>
                <div className="field-row">
                  <dt>Routes</dt>
                  <dd>{String(crag.routeCount ?? 0)}</dd>
                </div>
                <div className="field-row">
                  <dt>Logs</dt>
                  <dd>{String(crag.logCount ?? 0)}</dd>
                </div>
                <div className="field-row">
                  <dt>Created</dt>
                  <dd>{crag.createdAt ? String(crag.createdAt).slice(0, 10) : '—'}</dd>
                </div>
                <div className="field-row">
                  <dt>Created By</dt>
                  <dd>
                    {crag.createdBy
                      ? String((crag.createdBy as Record<string, unknown>).nickname ?? '—')
                      : '—'}
                  </dd>
                </div>
              </dl>
            </div>

            <CragImageUpload
              slug={slug}
              currentImage={crag.image ? String(crag.image) : undefined}
            />

            <div className="detail-card">
              <h3>Tags</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {Array.isArray(crag.tags) && crag.tags.length > 0 ? (
                  (crag.tags as string[]).map((tag) => (
                    <span key={tag} className="badge badge-info">{tag}</span>
                  ))
                ) : (
                  <span className="has-text-grey-light">No tags</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="data-table" style={{ marginBottom: '1.5rem' }}>
          <div className="table-header">
            <h3>Areas ({areas.length})</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Rock Type</th>
                <th>Routes</th>
                <th>Verified</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {areas.map((a) => (
                <tr key={String(a.sk)}>
                  <td>
                    <Link href={`/areas/${String(a.slug ?? '')}`}>{String(a.title ?? '—')}</Link>
                  </td>
                  <td>{String(a.rockType ?? '—')}</td>
                  <td>{String(a.routeCount ?? 0)}</td>
                  <td>
                    <span className={`badge ${a.verified ? 'badge-success' : 'badge-warning'}`}>
                      {a.verified ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td>
                    <ConfirmButton
                      action={async () => {
                        'use server';
                        await setAreaVerified(String(a.hk), String(a.sk), String(a.slug), !a.verified);
                      }}
                      message={a.verified ? `Unverify area "${String(a.title)}"?` : `Verify area "${String(a.title)}"?`}
                      className={`button is-small ${a.verified ? 'is-warning' : 'is-success'}`}
                    >
                      {a.verified ? 'Unverify' : 'Verify'}
                    </ConfirmButton>
                  </td>
                </tr>
              ))}
              {areas.length === 0 && (
                <tr>
                  <td colSpan={5} className="has-text-centered has-text-grey-light">No areas</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="data-table">
          <div className="table-header">
            <h3>Routes ({routes.length})</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Grade</th>
                <th>Type</th>
                <th>Area</th>
                <th>Logs</th>
                <th>Verified</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {routes.map((r) => (
                <tr key={String(r.sk)}>
                  <td>
                    <Link href={`/routes/${String(r.slug ?? '')}`}>{String(r.title ?? '—')}</Link>
                  </td>
                  <td>{String(r.grade ?? '—')}</td>
                  <td>{String(r.routeType ?? '—')}</td>
                  <td>{String(r.areaTitle ?? '—')}</td>
                  <td>{String(r.logCount ?? 0)}</td>
                  <td>
                    <span className={`badge ${r.verified ? 'badge-success' : 'badge-warning'}`}>
                      {r.verified ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td>
                    <ConfirmButton
                      action={async () => {
                        'use server';
                        await setRouteVerified(String(r.hk), String(r.sk), String(r.slug), !r.verified);
                      }}
                      message={r.verified ? `Unverify route "${String(r.title)}"?` : `Verify route "${String(r.title)}"?`}
                      className={`button is-small ${r.verified ? 'is-warning' : 'is-success'}`}
                    >
                      {r.verified ? 'Unverify' : 'Verify'}
                    </ConfirmButton>
                  </td>
                </tr>
              ))}
              {routes.length === 0 && (
                <tr>
                  <td colSpan={7} className="has-text-centered has-text-grey-light">No routes</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
