import { logError } from '@/lib/log'
import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import type { RouteRequest } from '@climbingtopos/types'
import { NewRouteScheme } from '@climbingtopos/schemas'
import { routes } from '@/data/services'
import { getAuthUser } from '@/lib/auth'

export const postFn = createServerFn({ method: 'POST' })
  .inputValidator(async (data: unknown) => {
    const input = data as RouteRequest
    await NewRouteScheme().validate(input, { stripUnknown: true, abortEarly: false })
    return input
  })
  .handler(async ({ data }) => {
    try {
      const user = await getAuthUser()

      if (!user) {
        throw redirect({ to: '/login' })
      }

      const resp = await routes.createRoute(data, user.properties as any)

      return { success: true, inserted: resp }
    } catch (err) {
      logError('action:routes/post', err)
      throw err
    }
  })
