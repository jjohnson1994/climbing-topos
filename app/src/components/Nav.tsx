import React, { useState } from "react";
import { Link } from "react-router-dom";
import useUser from "../api/user";
import Button, { Color } from "../elements/Button";
import NavbarItem from "../elements/NavbarItem";

function Nav() {
  const [navBarMenuClass, setNavBarMenuClass] = useState("");
  const { isAuthenticated } = useUser();

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
        <Link className="navbar-item has-text-weight-medium" to="/">
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
            to="/crags"
          >
            Crags
          </Link>
          <Link
            className="navbar-item"
            to="/crags-map"
          >
            Map
          </Link>
        </div>

        <div className="navbar-end">
          <NavbarItem>
            <Link to="/search" className="navbar-item">
              <i className="fas fa-search"></i>
            </Link>
          </NavbarItem>
          <div className="navbar-item">
            {isAuthenticated ? (
              <Link to="/profile">
                <Button icon="fas fa-user">Profile</Button>
              </Link>
            ) : (
              <div className="field is-grouped">
                <p className="control">
                  <Link to="/login">
                    <Button>Login</Button>
                  </Link>
                </p>
                <p className="control">
                  <Link to="/signup">
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
