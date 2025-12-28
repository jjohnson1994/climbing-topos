'use server';

import ProfileLogs from '@/app/components/ProfileLogs';
import ProfileLists from '@/app/components/ProfileLists';
import { auth, logout } from '@/app/actions';
import Link from 'next/link';
import { redirect } from 'next/navigation';

async function Profile(props) {
  const searchParams = await props.searchParams;
  const activeTab = searchParams.tab || 'logs';
  const user = await auth();

  if (!user) {
    redirect('/login');
  }

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
                      <b>0</b> Climbs Logged
                    </p>
                  </div>{' '}
                  <div>
                    <p>
                      <b>0</b> Crags Visited
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
            <li className={activeTab === 'logs' ? 'is-active' : ''}>
              <Link href="?tab=logs">Logs</Link>
            </li>
            <li className={activeTab === 'lists' ? 'is-active' : ''}>
              <Link href="?tab=lists">Lists</Link>
            </li>
          </ul>
        </div>
        <div className={`container ${activeTab === 'logs' ? '' : 'is-hidden'}`}>
          {<ProfileLogs />}
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
