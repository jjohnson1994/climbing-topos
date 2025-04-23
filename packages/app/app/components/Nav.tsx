import React from 'react';
import Link from 'next/link';
import Button from '@/app/elements/Button';
import NavbarItem from '@/app/elements/NavbarItem';
import { login } from '@/app/actions';
import NavBurgerIcon from './NavBurgerIcon';

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

        <NavBurgerIcon />
      </div>
      <div id="navbarBasicExample" className="navbar-menu">
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
