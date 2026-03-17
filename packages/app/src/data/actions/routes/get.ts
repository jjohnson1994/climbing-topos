import { logError } from '@/lib/log'
import { createServerFn } from '@tanstack/react-start'
import { routes } from '@/data/services'
import { getAuthUser } from '@/lib/auth'

export const getFn = createServerFn({ method: 'GET' })
  .inputValidator((data: {
    cragSlug: string
    areaSlug: string
    topoSlug: string
    routeSlug: string
  }) => data)
  .handler(async ({ data }): Promise<any> => {
    try {
      const user = await getAuthUser()
      const userSub = user ? user.properties.sub : undefined

      return await routes.listRoutes(
        userSub || '',
        data.cragSlug,
        data.areaSlug,
        data.topoSlug,
        data.routeSlug,
      )
    } catch (err) {
      logError('action:routes/get', err)
      throw err
    }
  })
