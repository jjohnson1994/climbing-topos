import { Resource } from 'sst'
import { PostHog } from 'posthog-node'

export const postHogClient = new PostHog(Resource.PostHogKey.value, {
  host: Resource.PostHogHost.value,
})
