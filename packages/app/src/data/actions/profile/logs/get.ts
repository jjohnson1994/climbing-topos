import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { getAuthUser } from '@/lib/auth'
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
    const user = await getAuthUser()
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
  },
)
