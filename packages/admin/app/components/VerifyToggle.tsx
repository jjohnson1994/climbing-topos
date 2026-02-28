'use client';

import { useTransition } from 'react';

interface VerifyToggleProps {
  verified: boolean;
  onToggle: () => Promise<void>;
}

export default function VerifyToggle({ verified, onToggle }: VerifyToggleProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      className={`button is-small ${verified ? 'is-warning' : 'is-success'}`}
      disabled={isPending}
      onClick={() => startTransition(() => onToggle())}
    >
      {isPending ? '...' : verified ? 'Unverify' : 'Verify'}
    </button>
  );
}
