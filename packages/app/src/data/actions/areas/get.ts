import { logError } from '@/lib/log'
import { createServerFn } from '@tanstack/react-start'
import { areas } from '@/data/services'
import { getAuthUser } from '@/lib/auth'

export const getFn = createServerFn({ method: 'GET' })
  .inputValidator((data: { areaSlug: string }) => data)
  .handler(async ({ data }): Promise<any> => {
    try {
      const user = await getAuthUser()
      const userSub = user ? user.properties.sub : undefined

      return await areas.getAreaBySlug(data.areaSlug, userSub)
    } catch (err) {
      logError('action:areas/get', err)
      throw err
    }
  })
