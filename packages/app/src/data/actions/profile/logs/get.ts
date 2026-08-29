import { logError } from '@/lib/log'
import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { getVerifiedUser } from '@/lib/auth'
import { logs } from '@/data/services'

export const getFn = createServerFn({ method: 'GET' })
  .inputValidator((data: {
      cragSlug?: string
      areaSlug?: string
      topoSlug?: string
      routeSlug?: string
    } | undefined) => data)
  .handler(
  async (ctx: {
    data?: {
      cragSlug?: string
      areaSlug?: string
      topoSlug?: string
      routeSlug?: string
    }
  }) => {
    try {
      const user = await getVerifiedUser()
      const userSub = user ? user.properties.sub : undefined

      if (!userSub) {
        throw redirect({ to: '/login' })
      }

      const data = ctx.data ?? {}

      return await logs.getUserLogs(
        userSub,
        data.cragSlug,
        data.areaSlug,
        data.topoSlug,
        data.routeSlug,
      )
    } catch (err) {
      logError('action:profile/logs/get', err)
      throw err
    }
  },
)
