export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { listUsers, countUsers } from '@/app/data/models/users';
import { parseCursor } from '@/app/lib/cursor';

interface Props {
  searchParams: Promise<{ cursor?: string }>;
}

export default async function UsersPage({ searchParams }: Props) {
  const { cursor } = await searchParams;
  const lastKey = parseCursor(cursor);

  const [total, { items, lastKey: nextKey }] = await Promise.all([
    countUsers(),
    listUsers(50, lastKey),
  ]);

  const nextCursor = nextKey
    ? Buffer.from(JSON.stringify(nextKey)).toString('base64')
    : undefined;

  return (
    <>
      <div className="admin-topbar">
        <h2>Users</h2>
        <span className="badge badge-info">{total.toLocaleString()} total</span>
      </div>

      <div className="admin-content">
        <div className="data-table">
          <div className="table-header">
            <h3>All Users</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Nickname</th>
                <th>Status</th>
                <th>ID</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <tr key={String(u.hk)}>
                  <td>{String(u.email ?? '—')}</td>
                  <td>{String(u.nickname ?? '—')}</td>
                  <td>
                    <span
                      className={`badge ${
                        u.status === 'active'
                          ? 'badge-success'
                          : u.status === 'pending'
                            ? 'badge-warning'
                            : 'badge-default'
                      }`}
                    >
                      {String(u.status ?? 'unknown')}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {String(u.hk ?? '').slice(0, 12)}…
                  </td>
                  <td>
                    {u.createdAt ? String(u.createdAt).slice(0, 10) : '—'}
                  </td>
                  <td>
                    <Link
                      href={`/users/${String(u.hk ?? '')}`}
                      className="button is-small is-light"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="table-footer">
            <span>Showing {items.length} users</span>
            {nextCursor && (
              <Link
                href={`/users?cursor=${nextCursor}`}
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
