export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getUserById } from '@/app/data/models/users';
import { setUserStatus, deleteUser } from '@/app/actions';
import ConfirmButton from '@/app/components/ConfirmButton';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: Props) {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) notFound();

  return (
    <>
      <div className="admin-topbar">
        <h2>
          <Link href="/users" className="has-text-grey">
            Users
          </Link>{' '}
          / {String(user.nickname ?? user.email ?? id)}
        </h2>
      </div>

      <div className="admin-content">
        <div className="columns">
          <div className="column is-two-thirds">
            <div className="detail-card">
              <h3>User Details</h3>
              <dl>
                <div className="field-row">
                  <dt>ID</dt>
                  <dd style={{ fontFamily: 'monospace' }}>{String(user.hk ?? '')}</dd>
                </div>
                <div className="field-row">
                  <dt>Email</dt>
                  <dd>{String(user.email ?? '—')}</dd>
                </div>
                <div className="field-row">
                  <dt>Nickname</dt>
                  <dd>{String(user.nickname ?? '—')}</dd>
                </div>
                <div className="field-row">
                  <dt>Status</dt>
                  <dd>
                    <span
                      className={`badge ${
                        user.status === 'active'
                          ? 'badge-success'
                          : user.status === 'pending'
                            ? 'badge-warning'
                            : 'badge-default'
                      }`}
                    >
                      {String(user.status ?? 'unknown')}
                    </span>
                  </dd>
                </div>
                {!!user.picture && (
                  <div className="field-row">
                    <dt>Avatar</dt>
                    <dd>
                      <img
                        src={String(user.picture)}
                        alt="avatar"
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                      />
                    </dd>
                  </div>
                )}
                <div className="field-row">
                  <dt>Created</dt>
                  <dd>{user.createdAt ? String(user.createdAt).slice(0, 19) : '—'}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="column">
            <div className="detail-card">
              <h3>Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {user.status !== 'active' && (
                  <ConfirmButton
                    action={async () => {
                      'use server';
                      await setUserStatus(id, 'active');
                    }}
                    message={`Activate user ${String(user.email ?? id)}?`}
                    className="button is-success is-fullwidth"
                  >
                    Activate User
                  </ConfirmButton>
                )}
                {user.status === 'active' && (
                  <ConfirmButton
                    action={async () => {
                      'use server';
                      await setUserStatus(id, 'suspended');
                    }}
                    message={`Suspend user ${String(user.email ?? id)}?`}
                    className="button is-warning is-fullwidth"
                  >
                    Suspend User
                  </ConfirmButton>
                )}
                <ConfirmButton
                  action={async () => {
                    'use server';
                    await deleteUser(id);
                  }}
                  message={`Permanently delete user ${String(user.email ?? id)}? This cannot be undone.`}
                  className="button is-danger is-outlined is-fullwidth"
                >
                  Delete User
                </ConfirmButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
