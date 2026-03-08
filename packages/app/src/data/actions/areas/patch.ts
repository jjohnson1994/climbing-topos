import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import type { AreaPatch } from '@climbingtopos/types'
import { UpdateAreaSchema } from '@climbingtopos/schemas'
import { areas, crags } from '@/data/services'
import { getAuthUser } from '@/lib/auth'

export const patchFn = createServerFn({ method: 'POST' })
  .inputValidator(async (data: { areaSlug: string; body: AreaPatch }) => {
    await UpdateAreaSchema().validate(data.body, { strict: true, abortEarly: false })
    return data
  })
  .handler(async ({ data }) => {
    const user = await getAuthUser()

    if (!user) {
      throw redirect({ to: '/login' })
    }

    const userSub = user.properties.sub
    const area = await areas.getAreaBySlug(data.areaSlug)
    const crag = await crags.getCragBySlug(area.cragSlug, userSub || '')

    if (crag.managedBy.sub !== userSub) {
      throw new Error(
        'Permission Error: You Do Not Have Permission to Patch this Area',
      )
    }

    await areas.updateArea(crag.slug, data.areaSlug, data.body)

    return { success: true }
  })
