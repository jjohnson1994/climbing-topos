import React, { useState } from "react";
import { Link } from "react-router-dom";

function Nav() {
  const [navBarMenuClass, setNavBarMenuClass] = useState("");

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
          <div className="navbar-item">
            <a className="button is-rounded is-white" href="profile">
              <span className="icon">
                <i className="fas fa-user fa-lg"></i>
              </span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
