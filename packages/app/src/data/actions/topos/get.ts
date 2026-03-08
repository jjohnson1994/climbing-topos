import { createServerFn } from '@tanstack/react-start'
import { topos } from '@/data/services'

export const getFn = createServerFn({ method: 'GET' })
  .inputValidator((data: { topoSlug: string }) => data)
  .handler(async ({ data }): Promise<any> => {
    return await topos.getTopoBySlug(data.topoSlug)
  })
