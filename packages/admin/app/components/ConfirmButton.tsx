'use client';

import { useTransition } from 'react';

interface ConfirmButtonProps {
  action: () => Promise<void>;
  message: string;
  children: React.ReactNode;
  className?: string;
}

export default function ConfirmButton({
  action,
  message,
  children,
  className,
}: ConfirmButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (window.confirm(message)) {
      startTransition(() => action());
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      disabled={isPending}
    >
      {isPending ? 'Working…' : children}
    </button>
  );
}
