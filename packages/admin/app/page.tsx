export const dynamic = 'force-dynamic';

import Link from 'next/link';
import StatCard from '@/app/components/StatCard';
import { countUsers, listUsers } from '@/app/data/models/users';
import { countCrags, listCrags } from '@/app/data/models/crags';
import { countAreas } from '@/app/data/models/areas';
import { countRoutes, listRoutes } from '@/app/data/models/routes';
import { countLogs, listLogs } from '@/app/data/models/logs';

export default async function DashboardPage() {
  const [userCount, cragCount, areaCount, routeCount, logCount, recentUsers, recentCrags, recentRoutes, recentLogs] =
    await Promise.all([
      countUsers(),
      countCrags(),
      countAreas(),
      countRoutes(),
      countLogs(),
      listUsers(5),
      listCrags(5),
      listRoutes(5),
      listLogs(5),
    ]);

  return (
    <>
      <div className="admin-topbar">
        <h2>Dashboard</h2>
      </div>

      <div className="admin-content">
        <div className="columns">
          <div className="column">
            <StatCard title="Users" value={userCount} icon="👤" color="blue" />
          </div>
          <div className="column">
            <StatCard title="Crags" value={cragCount} icon="🧗" color="green" />
          </div>
          <div className="column">
            <StatCard title="Areas" value={areaCount} icon="📍" color="purple" />
          </div>
          <div className="column">
            <StatCard title="Routes" value={routeCount} icon="🪨" color="orange" />
          </div>
          <div className="column">
            <StatCard title="Logs" value={logCount} icon="📋" color="red" />
          </div>
        </div>

        <div className="columns">
          <div className="column">
            <div className="data-table">
              <div className="table-header">
                <h3>Recent Users</h3>
                <Link href="/users" className="button is-small is-light">
                  View all
                </Link>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Nickname</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.items.map((u, i) => (
                    <tr key={i}>
                      <td>
                        <Link href={`/users/${String(u.hk ?? '')}`}>
                          {String(u.email ?? '—')}
                        </Link>
                      </td>
                      <td>{String(u.nickname ?? '—')}</td>
                      <td>
                        <span
                          className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-warning'}`}
                        >
                          {String(u.status ?? 'unknown')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="column">
            <div className="data-table">
              <div className="table-header">
                <h3>Recent Crags</h3>
                <Link href="/crags" className="button is-small is-light">
                  View all
                </Link>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Country</th>
                    <th>Verified</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCrags.items.map((c, i) => (
                    <tr key={i}>
                      <td>
                        <Link href={`/crags/${String(c.slug ?? '')}`}>
                          {String(c.title ?? '—')}
                        </Link>
                      </td>
                      <td>{String(c.country ?? '—')}</td>
                      <td>
                        <span
                          className={`badge ${c.verified ? 'badge-success' : 'badge-warning'}`}
                        >
                          {c.verified ? 'Yes' : 'No'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="columns">
          <div className="column">
            <div className="data-table">
              <div className="table-header">
                <h3>Recent Routes</h3>
                <Link href="/routes" className="button is-small is-light">
                  View all
                </Link>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Grade</th>
                    <th>Type</th>
                    <th>Verified</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRoutes.items.map((r, i) => (
                    <tr key={i}>
                      <td>
                        <Link href={`/routes/${String(r.slug ?? '')}`}>
                          {String(r.title ?? '—')}
                        </Link>
                      </td>
                      <td>{String(r.grade ?? '—')}</td>
                      <td>{String(r.routeType ?? '—')}</td>
                      <td>
                        <span
                          className={`badge ${r.verified ? 'badge-success' : 'badge-warning'}`}
                        >
                          {r.verified ? 'Yes' : 'No'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="column">
            <div className="data-table">
              <div className="table-header">
                <h3>Recent Logs</h3>
                <Link href="/logs" className="button is-small is-light">
                  View all
                </Link>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Route</th>
                    <th>Crag</th>
                    <th>Grade</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLogs.items.map((l, i) => (
                    <tr key={i}>
                      <td>{String(l.routeTitle ?? '—')}</td>
                      <td>{String(l.cragTitle ?? '—')}</td>
                      <td>{String(l.grade ?? '—')}</td>
                      <td>
                        {l.dateSent
                          ? String(l.dateSent).slice(0, 10)
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
