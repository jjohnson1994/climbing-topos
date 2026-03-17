import { logError } from '@/lib/log'
import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import type { TopoPatch } from '@climbingtopos/types'
import { UpdateTopoSchema } from '@climbingtopos/schemas'
import { crags, topos } from '@/data/services'
import { getAuthUser } from '@/lib/auth'

export const patchFn = createServerFn({ method: 'POST' })
  .inputValidator(async (data: { topoSlug: string; body: TopoPatch }) => {
    await UpdateTopoSchema().validate(data.body, { strict: true, abortEarly: false })
    return data
  })
  .handler(async ({ data }) => {
    try {
      const user = await getAuthUser()

      if (!user) {
        throw redirect({ to: '/login' })
      }

      const userSub = user.properties.sub || ''
      const topo = await topos.getTopoBySlug(data.topoSlug)
      const crag = await crags.getCragBySlug(topo.cragSlug, userSub)
      if (!crag) throw new Error('Crag not found')

      if (crag.managedBy.sub !== userSub) {
        throw new Error(
          'Permission Error: You Do Not Have Permission to Patch this Topo',
        )
      }

      await topos.updateTopo(topo.cragSlug, topo.areaSlug, data.topoSlug, data.body)

      return { success: true }
    } catch (err) {
      logError('action:topos/patch', err)
      throw err
    }
  })
