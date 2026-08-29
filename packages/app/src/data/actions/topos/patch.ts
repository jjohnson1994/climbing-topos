import { logError } from '@/lib/log'
import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import type { TopoPatch } from '@climbingtopos/types'
import { UpdateTopoSchema } from '@climbingtopos/schemas'
import { crags, topos, files } from '@/data/services'
import { getVerifiedUser } from '@/lib/auth'

export const patchFn = createServerFn({ method: 'POST' })
  .inputValidator(async (data: { topoSlug: string; body: TopoPatch; imageBase64?: string }) => {
    await UpdateTopoSchema().validate(data.body, { strict: true, abortEarly: false })
    return data
  })
  .handler(async ({ data }) => {
    try {
      const user = await getVerifiedUser()

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

      const patch = { ...data.body }
      if (data.imageBase64) {
        const oldImageUrl = topo.image as string | undefined
        patch.image = await files.uploadImage(data.imageBase64)
        if (oldImageUrl) await files.deleteImage(oldImageUrl)
      }

      await topos.updateTopo(topo.cragSlug, topo.areaSlug, data.topoSlug, patch)

      return { success: true }
    } catch (err) {
      logError('action:topos/patch', err)
      throw err
    }
  })
