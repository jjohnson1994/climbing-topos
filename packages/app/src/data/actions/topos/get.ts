import { logError } from '@/lib/log'
import { createServerFn } from '@tanstack/react-start'
import { topos } from '@/data/services'

export const getFn = createServerFn({ method: 'GET' })
  .inputValidator((data: { topoSlug: string }) => data)
  .handler(async ({ data }): Promise<any> => {
    try {
      return await topos.getTopoBySlug(data.topoSlug)
    } catch (err) {
      logError('action:topos/get', err)
      throw err
    }
  })
