import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import ProfileStats from '@/components/ProfileStats'

export const Route = createFileRoute('/profile/stats')({
  component: ProfileStatsTab,
})

function ProfileStatsTab() {
  const { logs } = useLoaderData({ from: '/profile' })
  return <ProfileStats logs={logs} />
}
