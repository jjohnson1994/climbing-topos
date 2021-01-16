import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import ProfileLogs from "../../components/ProfileLogs";

function Profile() {
  const { logout, user } = useAuth0();
  const { name, picture, email } = user;
  const [activeTab, setActiveTab] = useState("logs");

  return (
    <>
      <section className="section">
        <div className="container box">
          <div className="columns is-mobile is-multiline is-centered">
            <div className="column is-narrow">
              <img src={ picture } alt="profile" />
            </div>            
            <div className="column">
              <div className="is-flex is-flex-column is-align-content-space-between" style={{ height: "100%" }}>
                <div className="is-flex-grow-1">
                  <span><b>Username </b> { name } </span>
                  <br />
                  <span><b>Email </b> { email } </span>
                </div>
                <button className="button" onClick={ () => logout() }>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="tabs">
          <ul>
            <li className={ activeTab === "logs" ? "is-active" : "" }>
              <a onClick={ () => setActiveTab("logs") }>Logs</a>
            </li>
          </ul>
        </div>
        { activeTab === "logs" && (
          <div className="container box">
            <ProfileLogs />
          </div>
        )}
      </section>
    </>
  );
}

export default Profile;
