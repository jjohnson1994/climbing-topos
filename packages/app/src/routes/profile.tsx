import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import ProfileLogs from '@/components/ProfileLogs'
import ProfileLists from '@/components/ProfileLists'
import ProfileStats from '@/components/ProfileStats'
import { getAuthUser, logoutFn } from '@/lib/auth'
import { getFn as getUserLogsFn } from '@/data/actions/profile/logs/get'
import { logError } from '@/lib/log'

export const Route = createFileRoute('/profile')({
  validateSearch: (search: Record<string, unknown>): { tab?: string } => ({
    tab: search.tab as string | undefined,
  }),
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
  component: ProfilePage,
})

function ProfilePage() {
  const { user, logs: safeLog, uniqueCrags } = Route.useLoaderData()
  const search = Route.useSearch()
  const activeTab = search.tab || 'stats'

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
                  <button
                    className="button"
                    onClick={() => logoutFn()}
                  >
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
            <li className={activeTab === 'stats' ? 'is-active' : ''}>
              <Link to="/profile" search={{ tab: 'stats' }}>
                Stats
              </Link>
            </li>
            <li className={activeTab === 'logs' ? 'is-active' : ''}>
              <Link to="/profile" search={{ tab: 'logs' }}>
                Logs
              </Link>
            </li>
            <li className={activeTab === 'lists' ? 'is-active' : ''}>
              <Link to="/profile" search={{ tab: 'lists' }}>
                Lists
              </Link>
            </li>
          </ul>
        </div>
        <div className={`container ${activeTab === 'logs' ? '' : 'is-hidden'}`}>
          <ProfileLogs logs={safeLog} />
        </div>
        <div
          className={`container ${activeTab === 'stats' ? '' : 'is-hidden'}`}
        >
          <ProfileStats logs={safeLog} />
        </div>
        <div
          className={`container ${activeTab === 'lists' ? '' : 'is-hidden'}`}
        >
          <ProfileLists />
        </div>
      </section>
    </>
  )
}
