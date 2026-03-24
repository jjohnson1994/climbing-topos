import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import ProfileLogs from '@/components/ProfileLogs'

export const Route = createFileRoute('/profile/logs')({
  component: ProfileLogsTab,
})

function ProfileLogsTab() {
  const { logs } = useLoaderData({ from: '/profile' })
  return <ProfileLogs logs={logs} />
}
