import React, { useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";

function Profile() {
  const { logout, user } = useAuth0();
  const { name, picture, email } = user;

  console.log(user);

  useEffect(() => {
    // window.location.replace(`${window.location.origin}/sign-in`);
  });

  return (
    <section className="section">
      <div className="container">
        <div className="box">
          <h1>{ name }</h1>
          <img src={ picture } />
          <h1>{ email }</h1>
          <button className="button" onClick={ logout }>
            Logout
          </button>
        </div>
      </div>
    </section>
  );
}

export default Profile;
