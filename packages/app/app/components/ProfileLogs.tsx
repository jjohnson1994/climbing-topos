import Link from 'next/link';
import { Log } from '@climbingtopos/types';
import { useGradeHelpers } from '@/app/api/grades';
import { popupError } from '@/app/helpers/alerts';

import { get as getUserLogs } from '@/app/data/actions/profile/logs/get';
import { auth } from '@/app/actions';

async function ProfileLogs() {
  const { convertGradeValueToGradeLabel } = useGradeHelpers();

  const user = await auth();

  if (!user) {
    throw new Error('user not authorised');
  }

  let loggedRoutes: Log[] = [];

  try {
    loggedRoutes = await getUserLogs();
  } catch (error) {
    console.error('Error loading user profile', error);
    popupError(
      "Something has gone wrong, your profile couldn't be loaded. sorry",
    );
  } finally {
  }

  return (
    <>
      {!loggedRoutes.length ? (
        <div className="block box">
          <p>It looks like you haven't logged any routes yet</p>
        </div>
      ) : (
        ''
      )}
      {loggedRoutes.length ? (
        <table className="box table is-fullwidth">
          <thead>
            <tr>
              <th>Route</th>
              <th>Grade</th>
              <th>Rating</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {loggedRoutes.map((log) => (
              <tr key={log.slug}>
                <td>
                  <Link
                    href={`/crags/${log.cragSlug}/areas/${log.areaSlug}/topos/${log.topoSlug}/routes/${log.routeSlug}`}
                  >
                    {log.routeTitle}
                  </Link>
                </td>
                <td>
                  {convertGradeValueToGradeLabel(
                    parseInt(log.gradeTaken),
                    log.gradingSystem,
                  )}
                </td>
                <td>{log.rating}</td>
                <td>{log.dateSent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        ''
      )}
    </>
  );
}

export default ProfileLogs;
