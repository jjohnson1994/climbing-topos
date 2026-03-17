import { logError } from '@/lib/log'
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
    try {
      return await logs.getLogs(
        ctx.data.cragSlug,
        ctx.data.areaSlug,
        ctx.data.topoSlug,
        ctx.data.routeSlug,
      )
    } catch (err) {
      logError('action:routes/logs/get', err)
      throw err
    }
  },
)
