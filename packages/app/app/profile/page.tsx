'use server';

import ProfileLogs from '@/app/components/ProfileLogs';
import ProfileLists from '@/app/components/ProfileLists';
import ProfileStats from '@/app/components/ProfileStats';
import { auth, logout } from '@/app/actions';
import { get as getUserLogs } from '@/app/data/actions/profile/logs/get';
import Link from 'next/link';
import { redirect } from 'next/navigation';

async function Profile(props: { searchParams: Promise<{ tab?: string }> }) {
  const searchParams = await props.searchParams;
  const activeTab = searchParams.tab || 'stats';
  const user = await auth();

  if (!user) {
    redirect('/login');
  }

  const logs = await getUserLogs();
  const safeLog = logs ?? [];
  const uniqueCrags = new Set(safeLog.map((l) => l.cragSlug)).size;

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
                  </div>{' '}
                  <div>
                    <p>
                      <b>{uniqueCrags}</b> Crags Visited
                    </p>
                  </div>
                </div>
                <div className="is-flex is-justify-content-flex-end mt-2">
                  <form action={logout}>
                    <button className="button">Logout</button>
                  </form>
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
              <Link href="?tab=stats">Stats</Link>
            </li>
            <li className={activeTab === 'logs' ? 'is-active' : ''}>
              <Link href="?tab=logs">Logs</Link>
            </li>
            <li className={activeTab === 'lists' ? 'is-active' : ''}>
              <Link href="?tab=lists">Lists</Link>
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
          {<ProfileLists />}
        </div>
      </section>
    </>
  );
}

export default Profile;
