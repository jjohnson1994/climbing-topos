import {useAuth0} from "@auth0/auth0-react";
import React from "react";
import {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import {Log} from "../../../core/types";
import {logs} from "../api";
import {popupError} from "../helpers/alerts";

function ProfileLogs() {
  const { getAccessTokenSilently, isLoading, isAuthenticated } = useAuth0();
  const [loggedRoutes, setLoggedRoutes] = useState<Log[]>([]);

  useEffect(() => {
    const getProfileDate = async () => {
      try {
        const token = await getAccessTokenSilently();
        const newLoggedRoutes = await logs.getProfileLogs(token);
        setLoggedRoutes(newLoggedRoutes); 
      } catch (error) {
        console.error("Error loading user profile", error);
        popupError("Something has gone wrong, your profile couldn't be loaded. sorry");
      }
    };

    if (isLoading === false && isAuthenticated === true) {
      getProfileDate();
    }
  }, [isLoading, isAuthenticated]);

  return (
    <table className="table is-fullwidth">
      <thead>
        <tr>
          <th>Route</th>
          <th>Grade</th>
          <th>Stars</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        { loggedRoutes.map(log => (
          <tr key={ log.slug } >
            <td>
              <Link to={ `/crags/${log.cragSlug}/areas/${log.areaSlug}/topos/${log.topoSlug}/routes/${log.routeSlug}` }>
                { log.routeTitle }
              </Link>
            </td>
            <td>{ log.gradeTaken }</td>
            <td>{ log.stars }</td>
            <td>{ log.dateSent }</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ProfileLogs;
