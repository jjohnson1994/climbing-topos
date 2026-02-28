export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import MigrationClient from './MigrationClient';

export default async function MigrationPage() {
  const cookieStore = await cookies();
  const currentEnv = cookieStore.get('admin_environment')?.value ?? 'dev';

  return (
    <>
      <div className="admin-topbar">
        <h2>Image URL Migration</h2>
      </div>
      <MigrationClient currentEnv={currentEnv} />
    </>
  );
}
