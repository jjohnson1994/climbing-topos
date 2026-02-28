'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import EnvironmentSwitcher from './EnvironmentSwitcher';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '⊞' },
  { href: '/users', label: 'Users', icon: '👤' },
  { href: '/crags', label: 'Crags', icon: '🧗' },
  { href: '/areas', label: 'Areas', icon: '📍' },
  { href: '/routes', label: 'Routes', icon: '🪨' },
  { href: '/logs', label: 'Logs', icon: '📋' },
  { href: '/migrate', label: 'Migrate', icon: '⚙' },
];

export default function AdminNav({ currentEnv }: { currentEnv: string }) {
  const pathname = usePathname();
  const isProduction = currentEnv === 'production';

  return (
    <aside className={`admin-sidebar${isProduction ? ' env-production' : ''}`}>
      <div className="sidebar-brand">
        <h1>Topos Admin</h1>
        {isProduction ? (
          <p className="env-warning">⚠ PRODUCTION</p>
        ) : (
          <p>dev</p>
        )}
      </div>

      <nav className="sidebar-menu">
        <ul className="menu-list">
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link href={item.href} className={isActive ? 'active' : ''}>
                  <span className="icon">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <EnvironmentSwitcher currentEnv={currentEnv} />
        <span>{process.env.AWS_REGION ?? 'eu-west-1'}</span>
      </div>
    </aside>
  );
}
