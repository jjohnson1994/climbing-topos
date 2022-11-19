import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Log } from "core/types";
import { logs } from "../api";
import { useGradeHelpers } from "../api/grades";
import { popupError } from "../helpers/alerts";
import LoadingSpinner from "./LoadingSpinner";
import useUser from "../api/user";

function ProfileLogs() {
  const { isAuthenticated, isAuthenticating } = useUser();
  const [loggedRoutes, setLoggedRoutes] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const { convertGradeValueToGradeLabel } = useGradeHelpers();

  useEffect(() => {
    const getProfileDate = async () => {
      try {
        setLoading(true);
        const newLoggedRoutes = await logs.getProfileLogs();
        setLoggedRoutes(newLoggedRoutes);
      } catch (error) {
        console.error("Error loading user profile", error);
        popupError(
          "Something has gone wrong, your profile couldn't be loaded. sorry"
        );
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticating === false && isAuthenticated === true) {
      getProfileDate();
    }
  }, [isAuthenticating, isAuthenticated]);

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && !loggedRoutes.length ? (
        <div className="block box">
          <p>It looks like you haven't logged any routes yet</p>
        </div>
      ) : (
        ""
      )}
      {!loading && loggedRoutes.length ? (
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
                    to={`/crags/${log.cragSlug}/areas/${log.areaSlug}/topo/${log.topoSlug}/routes/${log.routeSlug}`}
                  >
                    {log.routeTitle}
                  </Link>
                </td>
                <td>
                  {convertGradeValueToGradeLabel(
                    parseInt(log.gradeTaken),
                    log.gradingSystem
                  )}
                </td>
                <td>{log.rating}</td>
                <td>{log.dateSent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        ""
      )}
    </>
  );
}

export default ProfileLogs;
