import { logError } from '@/lib/log'
import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import type { CragPatch } from '@climbingtopos/types'
import { UpdateCragSchema } from '@climbingtopos/schemas'
import { crags } from '@/data/services'
import { getAuthUser } from '@/lib/auth'

export const patchFn = createServerFn({ method: 'POST' })
  .inputValidator(async (data: { cragSlug: string; body: CragPatch }) => {
    await UpdateCragSchema().validate(data.body, { strict: true, abortEarly: false })
    return data
  })
  .handler(async ({ data }) => {
    try {
      const user = await getAuthUser()

      if (!user) {
        throw redirect({ to: '/login' })
      }

      const userSub = user.properties.sub || ''
      const crag = await crags.getCragBySlug(data.cragSlug, userSub)
      if (!crag) throw new Error('Crag not found')

      if (crag.managedBy.sub !== userSub) {
        return {
          error: true,
          message: 'Permission Error: You Do Not Have Permission to Patch this Crag',
        }
      }

      await crags.updateCrag(data.cragSlug, data.body)

      return { success: true }
    } catch (err) {
      logError('action:crags/patch', err)
      throw err
    }
  })
