export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { listRoutes, countRoutes } from '@/app/data/models/routes';
import { parseCursor } from '@/app/lib/cursor';

interface Props {
  searchParams: Promise<{ cursor?: string }>;
}

export default async function RoutesPage({ searchParams }: Props) {
  const { cursor } = await searchParams;
  const lastKey = parseCursor(cursor);

  const [total, { items, lastKey: nextKey }] = await Promise.all([
    countRoutes(),
    listRoutes(50, lastKey),
  ]);

  const nextCursor = nextKey
    ? Buffer.from(JSON.stringify(nextKey)).toString('base64')
    : undefined;

  return (
    <>
      <div className="admin-topbar">
        <h2>Routes</h2>
        <span className="badge badge-info">{total.toLocaleString()} total</span>
      </div>

      <div className="admin-content">
        <div className="data-table">
          <div className="table-header">
            <h3>All Routes</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Grade</th>
                <th>Type</th>
                <th>Crag</th>
                <th>Area</th>
                <th>Logs</th>
                <th>Rating</th>
                <th>Verified</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={String(r.sk)}>
                  <td>
                    <Link href={`/routes/${String(r.slug ?? '')}`}>
                      {String(r.title ?? '—')}
                    </Link>
                  </td>
                  <td>{String(r.grade ?? '—')}</td>
                  <td>{String(r.routeType ?? '—')}</td>
                  <td>
                    <Link href={`/crags/${String(r.cragSlug ?? '')}`}>
                      {String(r.cragTitle ?? '—')}
                    </Link>
                  </td>
                  <td>{String(r.areaTitle ?? '—')}</td>
                  <td>{String(r.logCount ?? 0)}</td>
                  <td>{r.rating ? Number(r.rating).toFixed(1) : '—'}</td>
                  <td>
                    <span
                      className={`badge ${r.verified ? 'badge-success' : 'badge-warning'}`}
                    >
                      {r.verified ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td>
                    <Link
                      href={`/routes/${String(r.slug ?? '')}`}
                      className="button is-small is-light"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="table-footer">
            <span>Showing {items.length} routes</span>
            {nextCursor && (
              <Link
                href={`/routes?cursor=${nextCursor}`}
                className="button is-small is-light"
              >
                Next page →
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
