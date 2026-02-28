export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { listCrags, countCrags } from '@/app/data/models/crags';
import { parseCursor } from '@/app/lib/cursor';

interface Props {
  searchParams: Promise<{ cursor?: string }>;
}

export default async function CragsPage({ searchParams }: Props) {
  const { cursor } = await searchParams;
  const lastKey = parseCursor(cursor);

  const [total, { items, lastKey: nextKey }] = await Promise.all([
    countCrags(),
    listCrags(50, lastKey),
  ]);

  const nextCursor = nextKey
    ? Buffer.from(JSON.stringify(nextKey)).toString('base64')
    : undefined;

  return (
    <>
      <div className="admin-topbar">
        <h2>Crags</h2>
        <span className="badge badge-info">{total.toLocaleString()} total</span>
      </div>

      <div className="admin-content">
        <div className="data-table">
          <div className="table-header">
            <h3>All Crags</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Country</th>
                <th>County</th>
                <th>Areas</th>
                <th>Routes</th>
                <th>Logs</th>
                <th>Verified</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={String(c.slug)}>
                  <td>
                    <Link href={`/crags/${String(c.slug ?? '')}`}>
                      {String(c.title ?? '—')}
                    </Link>
                  </td>
                  <td>{String(c.country ?? '—')}</td>
                  <td>{String(c.county ?? '—')}</td>
                  <td>{String(c.areaCount ?? 0)}</td>
                  <td>{String(c.routeCount ?? 0)}</td>
                  <td>{String(c.logCount ?? 0)}</td>
                  <td>
                    <span
                      className={`badge ${c.verified ? 'badge-success' : 'badge-warning'}`}
                    >
                      {c.verified ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td>
                    <Link
                      href={`/crags/${String(c.slug ?? '')}`}
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
            <span>Showing {items.length} crags</span>
            {nextCursor && (
              <Link
                href={`/crags?cursor=${nextCursor}`}
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
