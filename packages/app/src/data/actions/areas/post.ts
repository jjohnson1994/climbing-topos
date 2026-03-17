import { logError } from '@/lib/log'
import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import type { AreaRequest } from '@climbingtopos/types'
import { NewAreaSchema } from '@climbingtopos/schemas'
import { areas, crags } from '@/data/services'
import { getAuthUser } from '@/lib/auth'

export const postFn = createServerFn({ method: 'POST' })
  .inputValidator(async (data: AreaRequest) => {
    const { cragSlug, ...areaData } = data
    await NewAreaSchema().validate(areaData, { abortEarly: false })
    return data
  })
  .handler(async ({ data }) => {
    try {
      const user = await getAuthUser()

      if (!user) {
        throw redirect({ to: '/login' })
      }

      await crags.getCragBySlug(data.cragSlug, user.properties.sub || '')

      const resp = await areas.createArea(data, user.properties as any)

      return { success: true, ...resp }
    } catch (err) {
      logError('action:areas/post', err)
      throw err
    }
  })
