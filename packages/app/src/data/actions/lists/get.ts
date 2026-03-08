import { createServerFn } from '@tanstack/react-start'
import { getAuthUser } from '@/lib/auth'
import { lists } from '@/data/services'

export const getFn = createServerFn({ method: 'GET' })
  .inputValidator((data: { slug?: string } | undefined) => data)
  .handler(async ({ data }): Promise<any> => {
    const user = await getAuthUser()
    const userSub = user ? user.properties.sub : undefined

    if (!userSub) {
      return []
    }

    const slug = data?.slug

    if (slug) {
      return await lists.getListBySlug(userSub, slug)
    }

    return await lists.getLists(userSub)
  })

export const getListsContainingRouteFn = createServerFn({ method: 'GET' })
  .inputValidator((data: { routeSlug: string }) => data)
  .handler(async ({ data }): Promise<any> => {
    const user = await getAuthUser()
    const userSub = user ? user.properties.sub : undefined

    if (!userSub) {
      return []
    }

    return await lists.getListsContainingRoute(userSub, data.routeSlug)
  })
