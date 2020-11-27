import React, { useEffect } from 'react';

function Profile() {
  useEffect(() => {
    window.location.replace(`${window.location.origin}/sign-in`);
  });

  return <h1>Profile</h1>;
}

export default Profile;
