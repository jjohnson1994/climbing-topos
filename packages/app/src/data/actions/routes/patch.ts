import { logError } from '@/lib/log'
import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import type { RoutePatch } from '@climbingtopos/types'
import { UpdateRouteScheme } from '@climbingtopos/schemas'
import { crags, routes } from '@/data/services'
import { getVerifiedUser } from '@/lib/auth'

export const patchFn = createServerFn({ method: 'POST' })
  .inputValidator(async (data: unknown) => {
    const input = data as { routeSlug: string; body: RoutePatch }
    await UpdateRouteScheme().validate(input.body, { strict: true, abortEarly: false })
    return input
  })
  .handler(async ({ data }) => {
    try {
      const user = await getVerifiedUser()

      if (!user) {
        throw redirect({ to: '/login' })
      }

      const userSub = user.properties.sub || ''
      const route = await routes.getRouteBySlug(data.routeSlug)
      const crag = await crags.getCragBySlug(route.cragSlug, userSub)
      if (!crag) throw new Error('Crag not found')

      if (crag.managedBy.sub !== userSub) {
        throw new Error(
          'Permission Error: You Do Not Have Permission to Patch this Route',
        )
      }

      await routes.updateRoute(
        route.cragSlug,
        route.areaSlug,
        route.topoSlug,
        data.routeSlug,
        data.body,
      )

      return { success: true }
    } catch (err) {
      logError('action:routes/patch', err)
      throw err
    }
  })
