"use client"

import { useState } from "react";
import ProfileLogs from "@/app/components/ProfileLogs";
import ProfileLists from "@/app/components/ProfileLists";
import { useRouter } from 'next/navigation'
import useUser from "@/app/api/user";

function Profile() {
  const { userAttributes, signOut } = useUser();
  const [activeTab, setActiveTab] = useState("logs");
  const router = useRouter()

  const handleLogout = async () => {
    await signOut();
    router.replace("/login");
  };

  return (
    <>
      <section className="section">
        <div className="container box">
          <div className="columns is-mobile is-multiline is-centered">
            {/** <div className="column is-narrow">
              <img src={userAttributes.picture} alt="profile" />
            </div> **/}
            <div className="column">
              <div
                className="is-flex is-flex-column is-align-content-space-between"
                style={{ height: "100%" }}
              >
                <div className="is-flex-grow-1">
                  <span>
                    <b>Username </b> {userAttributes?.username}{" "}
                  </span>
                  <br />
                  <span>
                    <b>Email </b> {userAttributes?.attributes?.email}{" "}
                  </span>
                </div>
                <div className="is-flex is-justify-content-flex-end mt-2">
                  <button className="button" onClick={handleLogout}>
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
            <li className={activeTab === "logs" ? "is-active" : ""}>
              <a onClick={() => setActiveTab("logs")}>Logs</a>
            </li>
            <li className={activeTab === "lists" ? "is-active" : ""}>
              <a onClick={() => setActiveTab("lists")}>Lists</a>
            </li>
          </ul>
        </div>
        <div className={`container ${activeTab === "logs" ? "" : "is-hidden"}`}>
          <ProfileLogs />
        </div>
        <div
          className={`container ${activeTab === "lists" ? "" : "is-hidden"}`}
        >
          <ProfileLists />
        </div>
      </section>
    </>
  );
}

export default Profile;
