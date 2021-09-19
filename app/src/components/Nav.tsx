import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "../elements/Button";
import NavbarItem from "../elements/NavbarItem";

function Nav() {
  const [navBarMenuClass, setNavBarMenuClass] = useState("");
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  const btnBurgerMenuOnClick = () => {
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
          onClick={ btnBurgerMenuOnClick }
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div
        id="navbarBasicExample"
        className={`navbar-menu ${navBarMenuClass}`}
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
          { isAuthenticated 
            ? <Link to="/profile">
                <Button icon="fas fa-user">
                  Profile
                </Button>
              </Link>
            : <Button onClick={ loginWithRedirect } icon="fas fa-user">
                Login
              </Button>
          }
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
