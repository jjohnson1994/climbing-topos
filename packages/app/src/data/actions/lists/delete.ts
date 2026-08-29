import { logError } from '@/lib/log'
import { createServerFn } from '@tanstack/react-start'
import { lists } from '@/data/services'
import { getVerifiedUser } from '@/lib/auth'

export const deleteRouteFromListFn = createServerFn({ method: 'POST' })
  .inputValidator((data: {
      listSlug: string
      cragSlug: string
      areaSlug: string
      topoSlug: string
      routeSlug: string
    }) => data)
  .handler(
  async (ctx: {
    data: {
      listSlug: string
      cragSlug: string
      areaSlug: string
      topoSlug: string
      routeSlug: string
    }
  }) => {
    try {
      const user = await getVerifiedUser()
      const userSub = user ? user.properties.sub : undefined

      if (!userSub) {
        return { success: false, error: 'Not authenticated' }
      }

      await lists.removeRouteFromList(
        userSub,
        ctx.data.listSlug,
        ctx.data.cragSlug,
        ctx.data.areaSlug,
        ctx.data.topoSlug,
        ctx.data.routeSlug,
      )

      return { success: true }
    } catch (err) {
      logError('action:lists/delete', err)
      throw err
    }
  },
)
