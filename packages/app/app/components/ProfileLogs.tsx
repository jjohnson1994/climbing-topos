import Link from 'next/link';
import { Log } from '@climbingtopos/types';
import { useGradeHelpers } from '@/app/api/grades';

function ProfileLogs({ logs }: { logs: Log[] }) {
  const { convertGradeValueToGradeLabel } = useGradeHelpers();

  return (
    <>
      {!logs.length ? (
        <div className="block box">
          <p>It looks like you haven&apos;t logged any routes yet</p>
        </div>
      ) : (
        ''
      )}
      {logs.length ? (
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
            {logs.map((log) => (
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
