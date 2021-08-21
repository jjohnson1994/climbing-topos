import { useState } from "react";
import { useAuth0, User } from "@auth0/auth0-react";
import ProfileLogs from "../../components/ProfileLogs";
import ProfileLists from "../../components/ProfileLists";

function Profile() {
  const { logout, user } = useAuth0();
  const { name, picture, email } = user as User;
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
                <div>
                  <button className="button" onClick={ () => logout() }>
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
            <li className={ activeTab === "logs" ? "is-active" : "" }>
              <a onClick={ () => setActiveTab("logs") }>Logs</a>
            </li>
            <li className={ activeTab === "lists" ? "is-active" : "" }>
              <a onClick={ () => setActiveTab("lists") }>Lists</a>
            </li>
          </ul>
        </div>
        <div className={ `container ${ activeTab === "logs" ? "" : "is-hidden" }` }>
          <ProfileLogs />
        </div>
        <div className={ `container ${ activeTab === "lists" ? "" : "is-hidden" }` }>
          <ProfileLists />
        </div>
      </section>
    </>
  );
}

export default Profile;
