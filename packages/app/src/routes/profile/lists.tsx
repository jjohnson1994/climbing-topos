import { createFileRoute } from '@tanstack/react-router'
import ProfileLists from '@/components/ProfileLists'

export const Route = createFileRoute('/profile/lists')({
  component: ProfileListsTab,
})

function ProfileListsTab() {
  return <ProfileLists />
}
