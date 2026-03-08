import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import type { RouteRequest } from '@climbingtopos/types'
import { NewRouteScheme } from '@climbingtopos/schemas'
import { routes } from '@/data/services'
import { getAuthUser } from '@/lib/auth'

export const postFn = createServerFn({ method: 'POST' })
  .inputValidator(async (data: RouteRequest) => {
    await NewRouteScheme().validate(data, { stripUnknown: true, abortEarly: false })
    return data
  })
  .handler(async ({ data }) => {
    const user = await getAuthUser()

    if (!user) {
      throw redirect({ to: '/login' })
    }

    const resp = await routes.createRoute(data, user.properties as any)

    return { success: true, inserted: resp }
  })
