export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { listAreas, countAreas } from '@/app/data/models/areas';
import { parseCursor } from '@/app/lib/cursor';

interface Props {
  searchParams: Promise<{ cursor?: string }>;
}

export default async function AreasPage({ searchParams }: Props) {
  const { cursor } = await searchParams;
  const lastKey = parseCursor(cursor);

  const [total, { items, lastKey: nextKey }] = await Promise.all([
    countAreas(),
    listAreas(50, lastKey),
  ]);

  const nextCursor = nextKey
    ? Buffer.from(JSON.stringify(nextKey)).toString('base64')
    : undefined;

  return (
    <>
      <div className="admin-topbar">
        <h2>Areas</h2>
        <span className="badge badge-info">{total.toLocaleString()} total</span>
      </div>

      <div className="admin-content">
        <div className="data-table">
          <div className="table-header">
            <h3>All Areas</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Crag</th>
                <th>Country</th>
                <th>Rock Type</th>
                <th>Routes</th>
                <th>Logs</th>
                <th>Verified</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={String(a.sk)}>
                  <td>
                    <Link href={`/areas/${String(a.slug ?? '')}`}>
                      {String(a.title ?? '—')}
                    </Link>
                  </td>
                  <td>
                    <Link href={`/crags/${String(a.cragSlug ?? '')}`}>
                      {String(a.cragTitle ?? '—')}
                    </Link>
                  </td>
                  <td>{String(a.country ?? '—')}</td>
                  <td>{String(a.rockType ?? '—')}</td>
                  <td>{String(a.routeCount ?? 0)}</td>
                  <td>{String(a.logCount ?? 0)}</td>
                  <td>
                    <span
                      className={`badge ${a.verified ? 'badge-success' : 'badge-warning'}`}
                    >
                      {a.verified ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td>
                    <Link
                      href={`/areas/${String(a.slug ?? '')}`}
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
            <span>Showing {items.length} areas</span>
            {nextCursor && (
              <Link
                href={`/areas?cursor=${nextCursor}`}
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
