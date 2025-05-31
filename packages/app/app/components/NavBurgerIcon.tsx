'use client';

import { useEffect, useState } from 'react';

export default function NavBurgerIcon() {
  const [open, setOpen] = useState(false);

  function handleClick() {
    const menu = document.getElementById('navbarBasicExample');
    menu?.classList.toggle('is-active');

    setOpen(!open);
  }

  useEffect(() => {
    const menu = document.getElementById('navbarBasicExample');
    const menuClickListener = menu?.addEventListener('click', (event) => {
      setTimeout(() => {
        menu?.classList.remove('is-active');
        setOpen(false);
      });
    });

    return () => {
      menu?.removeEventListener('click', menuClickListener);
    };
  });

  return (
    <a
      role="button"
      className={`navbar-burger burger ${open ? 'is-active' : ''}`}
      aria-label="menu"
      aria-expanded="false"
      data-target="navbarBasicExample"
      onClick={handleClick}
    >
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  );
}
