'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { setEnvironment } from '@/app/actions';

export default function EnvironmentSwitcher({ currentEnv }: { currentEnv: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(env: string) {
    if (env === currentEnv) return;
    startTransition(async () => {
      await setEnvironment(env);
      router.refresh();
    });
  }

  return (
    <div className="env-switcher">
      <label>Environment</label>
      <select
        value={currentEnv}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isPending}
      >
        <option value="dev">dev</option>
        <option value="production">production</option>
      </select>
    </div>
  );
}
