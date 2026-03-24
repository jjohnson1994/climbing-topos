import { createFileRoute, redirect, Link, Outlet, useMatch } from '@tanstack/react-router'
import { getAuthUser, logoutFn } from '@/lib/auth'
import { getFn as getUserLogsFn } from '@/data/actions/profile/logs/get'
import { logError } from '@/lib/log'

export const Route = createFileRoute('/profile')({
  loader: async () => {
    try {
      const user = await getAuthUser()

      if (!user) {
        throw redirect({ to: '/login' })
      }

      const logs = await getUserLogsFn()
      const safeLog = logs ?? []
      const uniqueCrags = new Set(safeLog.map((l) => l.cragSlug)).size

      return { user, logs: safeLog, uniqueCrags }
    } catch (err) {
      logError('loader:profile', err)
      throw err
    }
  },
  component: ProfileLayout,
})

function ProfileLayout() {
  const { user, logs: safeLog, uniqueCrags } = Route.useLoaderData()

  const statsMatch = useMatch({ from: '/profile/stats', shouldThrow: false })
  const logsMatch = useMatch({ from: '/profile/logs', shouldThrow: false })
  const listsMatch = useMatch({ from: '/profile/lists', shouldThrow: false })

  return (
    <>
      <section className="section">
        <div className="container box">
          <div className="columns is-mobile is-multiline is-centered">
            <div
              className="column is-one-quarter is-narrow"
              style={{ maxWidth: '200px' }}
            >
              <figure
                className="image is-1by1"
                style={{ width: '100%', maxWidth: '150px' }}
              >
                <img
                  src={user.properties.picture}
                  alt="profile"
                  className="is-rounded"
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center',
                    borderRadius: '4px',
                  }}
                />
              </figure>
            </div>
            <div className="column">
              <div className="is-flex is-flex-column is-align-content-space-between">
                <div className="mb-4">
                  <h5 className="title is-5">{user.properties.nickname}</h5>
                </div>
                <div className="is-flex is-flex-row">
                  <div className="mr-2">
                    <p>
                      <b>{safeLog.length}</b> Climbs Logged
                    </p>
                  </div>
                  <div>
                    <p>
                      <b>{uniqueCrags}</b> Crags Visited
                    </p>
                  </div>
                </div>
                <div className="is-flex is-justify-content-flex-end mt-2">
                  <button className="button" onClick={() => logoutFn()}>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="tabs">
          <ul>
            <li className={statsMatch ? 'is-active' : ''}>
              <Link
                to="/profile/stats"
                preload="intent"
                activeProps={{ 'aria-current': 'page' }}
              >
                Stats
              </Link>
            </li>
            <li className={logsMatch ? 'is-active' : ''}>
              <Link
                to="/profile/logs"
                preload="intent"
                activeProps={{ 'aria-current': 'page' }}
              >
                Logs
              </Link>
            </li>
            <li className={listsMatch ? 'is-active' : ''}>
              <Link
                to="/profile/lists"
                preload="intent"
                activeProps={{ 'aria-current': 'page' }}
              >
                Lists
              </Link>
            </li>
          </ul>
        </div>
        <div className="container">
          <Outlet />
        </div>
      </section>
    </>
  )
}
