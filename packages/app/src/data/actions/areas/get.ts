import { createServerFn } from '@tanstack/react-start'
import { areas } from '@/data/services'
import { getAuthUser } from '@/lib/auth'

export const getFn = createServerFn({ method: 'GET' })
  .inputValidator((data: { areaSlug: string }) => data)
  .handler(async ({ data }): Promise<any> => {
    const user = await getAuthUser()
    const userSub = user ? user.properties.sub : undefined

    return await areas.getAreaBySlug(data.areaSlug, userSub)
  })
