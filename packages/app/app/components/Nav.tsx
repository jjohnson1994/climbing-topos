import React from 'react';
import Link from 'next/link';
import Button from '@/app/elements/Button';
import NavbarItem from '@/app/elements/NavbarItem';
import { login } from '@/app/actions';

export default function Nav({ subject }) {
  return (
    <nav
      className="navbar has-shadow"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <Link className="navbar-item has-text-weight-medium" href="/">
          ClimbingTopos.com
        </Link>

        <a
          className="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div
        id="navbarBasicExample"
        className="navbar-menu"
        className={`navbar-menu`}
      >
        <div className="navbar-start">
          <Link className="navbar-item" href="/crags">
            Crags
          </Link>
          <Link className="navbar-item" href="/explore">
            Explore
          </Link>
        </div>

        <div className="navbar-end">
          <NavbarItem>
            <Link href="/search" className="navbar-item">
              <i className="fas fa-search"></i>
            </Link>
          </NavbarItem>
          <div className="navbar-item">
            {subject ? (
              <Link href="/profile">
                <Button icon="fas fa-user">
                  {subject.properties.nickname}
                </Button>
              </Link>
            ) : (
              <div className="field is-grouped">
                <form className="control" action={login}>
                  <Button>Login</Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
