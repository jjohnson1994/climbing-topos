import { createServerFn } from '@tanstack/react-start'
import { logs } from '@/data/services'

export const getFn = createServerFn({ method: 'GET' })
  .inputValidator((data: {
      cragSlug: string
      areaSlug: string
      topoSlug: string
      routeSlug: string
    }) => data)
  .handler(
  async (ctx: {
    data: {
      cragSlug: string
      areaSlug: string
      topoSlug: string
      routeSlug: string
    }
  }) => {
    return await logs.getLogs(
      ctx.data.cragSlug,
      ctx.data.areaSlug,
      ctx.data.topoSlug,
      ctx.data.routeSlug,
    )
  },
)
