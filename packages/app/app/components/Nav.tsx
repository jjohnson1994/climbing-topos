"use client"

import React, { useState } from "react";
import Link from "next/link";
import useUser from "@/app/api/user";
import Button, { Color } from "@/app/elements/Button";
import NavbarItem from "@/app/elements/NavbarItem";

import { Amplify } from "aws-amplify";
import config from "@/app/config";

Amplify.configure({
  Auth: {
    mandatorySignIn: false,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID,
  },
  // Storage: {
  //   region: config.s3.REGION,
  //   bucket: config.s3.BUCKET,
  //   identityPoolId: config.cognito.IDENTITY_POOL_ID,
  // },
  API: {
    endpoints: [
      {
        name: "climbingtopos2-api",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION,
      },
    ],
  },
});

function Nav() {
  const [navBarMenuClass, setNavBarMenuClass] = useState("");
  const { userAttributes, isAuthenticated } = useUser();

  const toggleNavMenu = () => {
    if (navBarMenuClass === "is-active") {
      setNavBarMenuClass("");
    } else {
      setNavBarMenuClass("is-active");
    }
  };

  return (
    <nav className="navbar has-shadow" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link className="navbar-item has-text-weight-medium" href="/">
          ClimbingTopos.com
        </Link>

        <a
          className="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
          onClick={ toggleNavMenu }
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div
        id="navbarBasicExample"
        className={`navbar-menu ${navBarMenuClass}`}
        onClick={ toggleNavMenu }
      >
        <div className="navbar-start">
          <Link
            className="navbar-item"
            href="/crags"
          >
            Crags
          </Link>
          <Link
            className="navbar-item"
            href="/crags-map"
          >
            Map
          </Link>
        </div>

        <div className="navbar-end">
          <NavbarItem>
            <Link href="/search" className="navbar-item">
              <i className="fas fa-search"></i>
            </Link>
          </NavbarItem>
          <div className="navbar-item">
            {isAuthenticated ? (
              <Link href="/profile">
                <Button icon="fas fa-user">{ userAttributes?.username }</Button>
              </Link>
            ) : (
              <div className="field is-grouped">
                <p className="control">
                  <Link href="/login">
                    <Button>Login</Button>
                  </Link>
                </p>
                <p className="control">
                  <Link href="/signup">
                    <Button color={ Color.isPrimary }>Signup</Button>
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
