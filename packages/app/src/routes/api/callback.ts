import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/api/callback' as any)({
  loader: async () => {
    throw redirect({ to: '/' })
  },
})
