import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import AdminNav from '@/app/components/AdminNav';
import './globals.scss';

export const metadata: Metadata = {
  title: 'Climbing Topos Admin',
  description: 'Local admin dashboard for climbing topos',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const currentEnv = cookieStore.get('admin_environment')?.value ?? 'dev';

  return (
    <html lang="en">
      <body>
        <div className="admin-layout">
          <AdminNav currentEnv={currentEnv} />
          <main className="admin-main">{children}</main>
        </div>
      </body>
    </html>
  );
}
