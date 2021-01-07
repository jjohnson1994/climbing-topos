import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import ProfileLogs from "../../components/ProfileLogs";

function Profile() {
  const { logout, user } = useAuth0();
  const { name, picture, email } = user;

  return (
    <>
      <section className="section">
        <div className="container">
          <div className="box">
            <h1>{ name }</h1>
            <img src={ picture } />
            <h1>{ email }</h1>
            <button className="button" onClick={ () => logout() }>
              Logout
            </button>
          </div>
          <div className="box">
            <ProfileLogs />
          </div>
        </div>
      </section>
    </>
  );
}

export default Profile;
