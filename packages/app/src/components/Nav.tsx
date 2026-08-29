import React from 'react';
import { Link } from '@tanstack/react-router';
import Button, { Color } from '@/elements/Button';
import NavbarItem from '@/elements/NavbarItem';
import NavBurgerIcon from './NavBurgerIcon';
import OfflineIndicator from './OfflineIndicator';

export default function Nav({ subject }: { subject: any }) {
  return (
    <nav
      className="navbar has-shadow"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <Link className="navbar-item has-text-weight-medium" to="/">
          ClimbingTopos.com
        </Link>

        <NavBurgerIcon />
      </div>
      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-start">
          <Link className="navbar-item" to="/crags">
            Crags
          </Link>
          <Link className="navbar-item" to="/explore">
            Explore
          </Link>
          <Link className="navbar-item" to="/offline">
            Downloaded
          </Link>
        </div>

        <div className="navbar-end">
          <NavbarItem>
            <OfflineIndicator />
          </NavbarItem>
          <NavbarItem>
            <Link to="/search" className="navbar-item">
              <i className="fas fa-search" aria-hidden="true"></i>
            </Link>
          </NavbarItem>
          <NavbarItem>
            {subject ? (
              <Link to="/profile">
                <Button icon="fas fa-user">
                  {subject.properties.nickname}
                </Button>
              </Link>
            ) : (
              <div className="buttons">
                <Link to="/signup" className="button is-primary">
                  Sign up
                </Link>
                <Link to="/login" className="button">
                  Log in
                </Link>
              </div>
            )}
          </NavbarItem>
        </div>
      </div>
    </nav>
  );
}
