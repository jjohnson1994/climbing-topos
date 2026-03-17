import { logError } from '@/lib/log'
import { createServerFn } from '@tanstack/react-start'
import { getAuthUser } from '@/lib/auth'
import { crags } from '@/data/services'

export const getFn = createServerFn({ method: 'GET' })
  .inputValidator((data: {
        cragSlug?: string
        sortBy?: string
        sortOrder?: 'DESC' | 'ASC'
        limit?: number
        offset?: number
      } | undefined) => data)
  .handler(async ({ data }): Promise<any> => {
      try {
        const user = await getAuthUser()
        const userSub = user ? user.properties.sub : undefined
        const d = data ?? {}

        if (d.cragSlug) {
          return await crags.getCragBySlug(d.cragSlug, userSub || '')
        } else {
          return await crags.getAllCrags(
            userSub || '',
            d.sortBy,
            d.sortOrder,
            d.limit ?? 10,
            d.offset ?? 0,
          )
        }
      } catch (err) {
        logError('action:crags/get', err)
        throw err
      }
    })
