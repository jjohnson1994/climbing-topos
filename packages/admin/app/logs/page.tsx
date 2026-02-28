export const dynamic = 'force-dynamic';

import { listLogs, countLogs } from '@/app/data/models/logs';
import { parseCursor } from '@/app/lib/cursor';
import { deleteLog } from '@/app/actions';
import Link from 'next/link';
import ConfirmButton from '@/app/components/ConfirmButton';

interface Props {
  searchParams: Promise<{ cursor?: string }>;
}

export default async function LogsPage({ searchParams }: Props) {
  const { cursor } = await searchParams;
  const lastKey = parseCursor(cursor);

  const [total, { items, lastKey: nextKey }] = await Promise.all([
    countLogs(),
    listLogs(50, lastKey),
  ]);

  const nextCursor = nextKey
    ? Buffer.from(JSON.stringify(nextKey)).toString('base64')
    : undefined;

  return (
    <>
      <div className="admin-topbar">
        <h2>Logs</h2>
        <span className="badge badge-info">{total.toLocaleString()} total</span>
      </div>

      <div className="admin-content">
        <div className="data-table">
          <div className="table-header">
            <h3>All Logs</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Route</th>
                <th>Crag</th>
                <th>User</th>
                <th>Grade</th>
                <th>Grade Taken</th>
                <th>Rating</th>
                <th>Date Sent</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((l, i) => {
                const user = l.user as Record<string, unknown> | undefined;
                const hk = String(l.hk ?? '');
                const sk = String(l.sk ?? '');
                const label = `${String(l.routeTitle ?? 'this log')} by ${user ? String(user.nickname ?? '?') : '?'}`;
                return (
                  <tr key={i}>
                    <td>
                      <Link href={`/routes/${String(l.routeSlug ?? '')}`}>
                        {String(l.routeTitle ?? '—')}
                      </Link>
                    </td>
                    <td>
                      <Link href={`/crags/${String(l.cragSlug ?? '')}`}>
                        {String(l.cragTitle ?? '—')}
                      </Link>
                    </td>
                    <td>{user ? String(user.nickname ?? '—') : '—'}</td>
                    <td>{String(l.grade ?? '—')}</td>
                    <td>{String(l.gradeTaken ?? '—')}</td>
                    <td>{l.rating ? `${Number(l.rating).toFixed(1)}/5` : '—'}</td>
                    <td>
                      {l.dateSent ? String(l.dateSent).slice(0, 10) : '—'}
                    </td>
                    <td>
                      <ConfirmButton
                        action={async () => {
                          'use server';
                          await deleteLog(hk, sk);
                        }}
                        message={`Delete log for "${label}"? This cannot be undone.`}
                        className="button is-small is-danger is-outlined"
                      >
                        Delete
                      </ConfirmButton>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="table-footer">
            <span>Showing {items.length} logs</span>
            {nextCursor && (
              <Link
                href={`/logs?cursor=${nextCursor}`}
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
